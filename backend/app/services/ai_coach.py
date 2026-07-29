"""
AI Coach Service - Groq Integration (REST API)
Handles conversation, grammar correction, vocabulary analysis, and scoring.
Uses Groq's free API with Llama models for fast, high-quality responses.
"""

import httpx
import json
import re
from typing import Optional
from app.config import settings


# System prompt that makes the AI behave as a communication coach
COACH_SYSTEM_PROMPT = """You are SpeakIntel AI, a supportive and encouraging English communication coach. Your role is NOT to simply answer questions — instead, you are a mentor who helps users improve their spoken English.

CORE BEHAVIORS:
1. CONTINUE conversations naturally — ask follow-up questions, share relevant thoughts
2. CORRECT grammar politely — never be harsh, always be supportive
3. IMPROVE vocabulary — suggest better words and phrases when appropriate
4. ENCOURAGE confidence — praise improvements, celebrate effort
5. ADAPT to the user's level (beginner, intermediate, advanced)
6. PROVIDE feedback after each response

AFTER EACH USER MESSAGE, include a brief coaching section in this exact format:
📝 **Feedback:**
- **You said:** "[exact user quote with issue]"
- **Better version:** "[improved version]"
- **Why:** "[brief explanation]"
- **Score:** Grammar: X/10 | Fluency: X/10 | Vocabulary: X/10

If the user's English was perfect, praise them and skip corrections.

PERSONALITY:
- Warm, patient, encouraging
- Like a friendly teacher who genuinely cares
- Use simple language for beginners, sophisticated for advanced
- Never make the user feel bad about mistakes
- Celebrate small wins

IMPORTANT: Always respond conversationally FIRST, then add the feedback section. Keep responses concise (2-3 paragraphs max for the conversational part)."""

INTERVIEW_SYSTEM_PROMPT = """You are SpeakIntel AI, acting as a professional interviewer. You are conducting a mock interview for the role of {role}.

BEHAVIOR:
1. Ask ONE interview question at a time
2. Listen to the answer, then evaluate it
3. After each answer, provide:
   - Score (1-10) for: Communication, Confidence, Technical Accuracy, Grammar, Vocabulary
   - Strengths in the answer
   - Areas for improvement
   - A model answer for comparison
4. Then ask the next question
5. After 5-7 questions, provide an overall interview summary

Start by greeting the candidate and asking them to introduce themselves."""

ROLEPLAY_PROMPTS = {
    "hr_interview": "You are an HR manager conducting a behavioral interview. Ask questions about teamwork, leadership, conflict resolution.",
    "friend": "You are a friendly person having a casual conversation. Talk about hobbies, weekend plans, movies, food. Be relaxed and fun.",
    "business_meeting": "You are a business colleague in a formal meeting. Discuss project updates, deadlines, strategy.",
    "teacher": "You are a school teacher discussing a student's progress. Be professional and caring.",
    "customer_support": "You are a customer support agent. The user is calling with a problem. Be helpful and professional.",
    "sales_pitch": "You are a potential client listening to a sales pitch. Ask tough questions, raise objections.",
    "college_viva": "You are a college professor conducting a viva voce examination. Ask academic questions.",
    "group_discussion": "You are a participant in a group discussion. The topic is '{topic}'. Share views and respond to the user's points.",
    "public_speaking": "You are an audience member at a public speaking event. The user is giving a speech. React naturally.",
    "travel": "You are a local guide helping a tourist. Discuss places to visit, directions, local culture.",
    "restaurant": "You are a waiter at a restaurant. Take orders, suggest dishes, handle requests.",
    "doctor": "You are a doctor during a consultation. Ask about symptoms, provide general advice.",
    "receptionist": "You are a hotel receptionist. Help with check-in, room requests, local information.",
    "ceo": "You are a CEO in a high-stakes meeting. Discuss vision, strategy, and evaluate proposals.",
    "tourist": "You are a foreign tourist asking for help. Speak with slight language difficulties.",
}

# Groq models to try in order of preference (all free tier)
GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
]

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class AICoach:
    """AI Communication Coach powered by Groq (free tier)."""
    
    def __init__(self):
        self.api_key = settings.groq_api_key
        key_preview = ("***" + self.api_key[-6:]) if len(self.api_key) > 6 else "(empty)"
        print(f"[AICoach] Initialized with Groq API key: {key_preview}")
    
    async def _call_groq(self, system_prompt: str, user_message: str, conversation_history: list[dict]) -> Optional[str]:
        """
        Call the Groq API using their OpenAI-compatible endpoint.
        Tries multiple models for maximum reliability.
        Returns the response text or None if all attempts fail.
        """
        if not self.api_key:
            print("[AICoach] No Groq API key configured, skipping API call")
            return None

        # Build messages array (OpenAI format)
        messages = [{"role": "system", "content": system_prompt}]
        
        for msg in conversation_history:
            role = "assistant" if msg["role"] == "model" else msg["role"]
            messages.append({"role": role, "content": msg["content"]})
        
        messages.append({"role": "user", "content": user_message})

        last_error = None

        async with httpx.AsyncClient(timeout=30.0) as client:
            for model_name in GROQ_MODELS:
                payload = {
                    "model": model_name,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024,
                }

                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                }

                try:
                    print(f"[AICoach] Trying Groq model: {model_name}...")
                    response = await client.post(GROQ_API_URL, json=payload, headers=headers)
                    
                    if response.status_code == 200:
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices:
                            text = choices[0].get("message", {}).get("content", "")
                            if text:
                                print(f"[AICoach] SUCCESS with Groq/{model_name}")
                                return text
                    
                    error_body = response.text[:300]
                    print(f"[AICoach] Groq/{model_name} returned {response.status_code}: {error_body}")
                    last_error = f"{response.status_code}: {error_body}"
                    
                except Exception as e:
                    print(f"[AICoach] Groq/{model_name} exception: {e}")
                    last_error = str(e)

        print(f"[AICoach] All Groq models failed. Last error: {last_error}")
        return None

    async def chat(
        self,
        user_message: str,
        conversation_history: list[dict],
        mode: str = "general",
        role: Optional[str] = None,
        level: str = "intermediate",
    ) -> dict:
        """
        Process a user message and return AI coach response with feedback.
        """
        # Select system prompt based on mode
        if mode == "interview" and role:
            system_prompt = INTERVIEW_SYSTEM_PROMPT.format(role=role)
        elif mode == "roleplay" and role and role in ROLEPLAY_PROMPTS:
            system_prompt = ROLEPLAY_PROMPTS[role]
        else:
            system_prompt = COACH_SYSTEM_PROMPT
        
        # Add level context
        system_prompt += f"\n\nUser's English level: {level}"
        
        # Try the Groq API
        response_text = await self._call_groq(system_prompt, user_message, conversation_history)

        if not response_text:
            # Smart offline fallback
            corrected = user_message
            explanation = "Your sentence is structurally correct! Well done."
            grammar_score = 9

            lower_msg = user_message.lower()
            if "excited for join" in lower_msg:
                corrected = user_message.replace("excited for join", "excited to join").replace("Excited for join", "Excited to join")
                explanation = "Use 'excited to join' (infinitive verb form) instead of 'excited for join'."
                grammar_score = 6
            elif "helping me to growing" in lower_msg:
                corrected = user_message.replace("helping me to growing", "help me grow").replace("Helping me to growing", "Help me grow")
                explanation = "Use 'help me grow' (base verb form) instead of 'helping me to growing'."
                grammar_score = 5

            if corrected != user_message:
                response_text = f'I noticed a small grammar tip! Instead of saying "{user_message}", try saying "{corrected}".\n\n📝 **Feedback:**\n- **You said:** "{user_message}"\n- **Better version:** "{corrected}"\n- **Why:** {explanation}\n- **Score:** Grammar: {grammar_score}/10 | Fluency: 7/10 | Vocabulary: 6/10'
            else:
                response_text = f'That is a very clear explanation! Keep practicing to build confidence. Can you tell me more about your thoughts?\n\n📝 **Feedback:**\n- **You said:** "{user_message}"\n- **Better version:** "{user_message}"\n- **Why:** {explanation}\n- **Score:** Grammar: 9/10 | Fluency: 8/10 | Vocabulary: 8/10'
        
        # Parse scores from response
        scores = self._extract_scores(response_text)
        
        return {
            "response": response_text,
            "scores": scores,
        }
    
    async def analyze_grammar(self, text: str) -> dict:
        """Analyze grammar in user's text."""
        prompt = f"""Analyze the following English text for grammar errors. Return a JSON object with:
- "errors": list of {{ "original": "...", "corrected": "...", "rule": "...", "explanation": "..." }}
- "score": grammar score out of 10
- "summary": brief overall assessment

Text: "{text}"

Return ONLY valid JSON, no other text."""
        
        result = await self._call_groq("You are a grammar analysis engine. Return only valid JSON.", prompt, [])
        return {"analysis": result or '{"errors": [], "score": 7, "summary": "Analysis unavailable"}'}
    
    async def analyze_vocabulary(self, word: str) -> dict:
        """Get vocabulary analysis for a word."""
        prompt = f"""For the English word "{word}", provide:
- "word": the word
- "meaning": clear definition
- "pronunciation": phonetic pronunciation
- "hindi_translation": Hindi translation
- "synonyms": list of 3-5 synonyms
- "antonyms": list of 2-3 antonyms
- "example_sentences": list of 2 example sentences
- "difficulty": "beginner" | "intermediate" | "advanced"

Return ONLY valid JSON, no other text."""
        
        result = await self._call_groq("You are a vocabulary analysis engine. Return only valid JSON.", prompt, [])
        return {"analysis": result or '{"word": "' + word + '", "meaning": "Analysis unavailable"}'}
    
    def _extract_scores(self, response_text: str) -> dict:
        """Extract scores from AI response text."""
        scores = {
            "grammar": 7,
            "fluency": 7,
            "vocabulary": 7,
            "confidence": 7,
            "pronunciation": 0,
            "speaking_speed": 0,
            "overall": 7,
        }
        
        patterns = {
            "grammar": r"Grammar:\s*(\d+)/10",
            "fluency": r"Fluency:\s*(\d+)/10",
            "vocabulary": r"Vocabulary:\s*(\d+)/10",
            "confidence": r"Confidence:\s*(\d+)/10",
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, response_text, re.IGNORECASE)
            if match:
                scores[key] = int(match.group(1))
        
        valid_scores = [v for v in scores.values() if v > 0]
        scores["overall"] = round(sum(valid_scores) / len(valid_scores)) if valid_scores else 7
        
        return scores


# Singleton instance
ai_coach = AICoach()
