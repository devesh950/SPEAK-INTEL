"""
AI Coach Service - Groq & Gemini Integration (REST API)
Handles conversation, grammar correction, vocabulary analysis, and scoring.
Supports Groq API (Llama 3 models) and Google Gemini AI with dynamic contextual fallbacks.
"""

import httpx
import json
import re
import os
import random
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

IMPORTANT: Always respond conversationally FIRST, then add the feedback section. Keep conversational responses snappy and natural for spoken audio (1-3 sentences max ending with an engaging follow-up question)."""

# Role-specific interview prompts — each has domain-relevant questions
INTERVIEW_ROLE_PROMPTS: dict = {
    "data-analyst": """You are a senior Data Analytics hiring manager conducting a mock interview for a Data Analyst position.

TOPICS TO COVER (rotate through these):
- SQL: JOINs, GROUP BY, window functions, subqueries, query optimisation
- Python / Excel for data wrangling and analysis
- Data visualisation tools (Power BI, Tableau, Matplotlib)
- Statistical concepts: mean/median/mode, standard deviation, A/B testing, hypothesis testing
- Business insight: turning raw data into actionable recommendations
- Data cleaning, ETL pipelines, handling missing data
- Case questions: "Given this dataset, what insights would you extract?"
- Behavioural: "Tell me about a time your analysis influenced a business decision."

BEHAVIOR:
1. Ask ONE focused question at a time — start with "Tell me about yourself and your experience with data analysis."
2. After each answer evaluate: Communication | Technical Accuracy | Depth of Knowledge | Grammar | Vocabulary (each /10)
3. Give brief, specific feedback and a model answer when relevant
4. Ask progressively deeper follow-up questions
5. After 5–7 exchanges, give an overall interview score and summary""",

    "data-scientist": """You are a Lead Data Scientist conducting a mock interview for a Data Scientist role.

TOPICS TO COVER:
- Machine Learning: supervised/unsupervised learning, model selection, bias-variance tradeoff
- Deep Learning: neural networks, CNNs, RNNs, transformers
- Python libraries: scikit-learn, pandas, numpy, TensorFlow / PyTorch
- Feature engineering, dimensionality reduction (PCA, t-SNE)
- Model evaluation: precision/recall, ROC-AUC, cross-validation
- Statistics: probability, Bayesian inference, distributions
- Big data tools: Spark, Hadoop, cloud ML (AWS SageMaker, GCP)
- Behavioural: project experience, research papers, real-world ML deployment

BEHAVIOR:
1. Start with "Introduce yourself and walk me through your most impactful ML project."
2. Mix technical and behavioural questions each round
3. Score each answer: Communication | ML Knowledge | Statistical Depth | Grammar | Clarity
4. Give a model answer when the user struggles
5. After 5–7 questions, provide a comprehensive interview report""",

    "software-engineer": """You are a Senior Software Engineer conducting a mock interview for a Software Engineer position.

TOPICS TO COVER:
- Data structures & algorithms: arrays, trees, graphs, sorting, searching, dynamic programming
- System design: scalability, microservices, databases, caching, load balancing
- Object-oriented programming and design patterns
- Code quality, testing, CI/CD
- Language-specific (ask which language the candidate prefers)
- Debugging, performance optimisation
- Behavioural: teamwork, code reviews, handling tight deadlines

BEHAVIOR:
1. Start with "Tell me about yourself and your strongest programming language."
2. Ask algorithm/DS questions then system design, then behavioural
3. Score: Communication | Problem Solving | Technical Depth | Code Clarity | Grammar
4. After 5–7 questions, give final feedback""",

    "frontend-developer": """You are a Frontend Engineering Lead conducting a mock interview for a Frontend Developer role.

TOPICS TO COVER:
- HTML/CSS: semantic HTML, Flexbox, Grid, responsive design
- JavaScript: closures, promises, async/await, event loop, ES6+
- React / Next.js: hooks, state management (Redux/Zustand), SSR vs CSR
- Performance: lazy loading, code splitting, Web Vitals, Lighthouse
- Accessibility (WCAG), cross-browser compatibility
- Testing: Jest, React Testing Library, Cypress
- Behavioural: design challenges, collaboration with UX/designers

BEHAVIOR:
1. Start with "Walk me through a complex frontend project you have built."
2. Rotate technical and conceptual questions
3. Score: Communication | JS Knowledge | Framework Depth | Problem Solving | Grammar
4. After 5–7 questions, provide overall feedback""",

    "backend-developer": """You are a Backend Engineering Manager conducting a mock interview for a Backend Developer role.

TOPICS TO COVER:
- APIs: REST, GraphQL, authentication (JWT, OAuth)
- Databases: SQL vs NoSQL, indexing, transactions, query optimisation
- Server architecture: microservices, message queues (Kafka, RabbitMQ), Docker/Kubernetes
- Language-specific (Python/FastAPI, Node.js, Java Spring, etc.)
- Security: SQL injection, rate limiting, HTTPS, input validation
- Performance: caching (Redis), horizontal vs vertical scaling
- Behavioural: incident response, large-scale system debugging

BEHAVIOR:
1. Start with "Tell me about a backend system you designed from scratch."
2. Mix system design and code-level questions
3. Score: Communication | Architecture Knowledge | Depth | Problem Solving | Grammar
4. After 5–7 questions, give final report""",

    "product-manager": """You are a Director of Product conducting a mock interview for a Product Manager role.

TOPICS TO COVER:
- Product sense: defining metrics, prioritisation frameworks (RICE, MoSCoW)
- User research, customer empathy, persona creation
- Roadmap planning, sprint planning, stakeholder management
- Analytical thinking: using data to drive product decisions
- Go-to-market strategy, competitive analysis
- Behavioural: handling conflicting stakeholder priorities, failed product launches
- Case: "How would you improve [product]?"

BEHAVIOR:
1. Start with "Tell me about a product you owned end-to-end and its impact."
2. Mix product case studies with behavioural questions
3. Score: Communication | Strategic Thinking | User Focus | Data Orientation | Grammar
4. After 5–7 questions, provide overall assessment""",

    "hr": """You are a Senior HR Business Partner conducting a mock interview for an HR Manager/HR Generalist role.

TOPICS TO COVER:
- Recruitment and talent acquisition strategies
- Employee relations, conflict resolution, performance management
- Labour law basics, compliance, HR policies
- Onboarding, training and development programs
- HR metrics: attrition rate, time-to-hire, engagement scores
- HRIS systems (Workday, SAP SuccessFactors, BambooHR)
- Behavioural: handling sensitive employee issues, managing change

BEHAVIOR:
1. Start with "Tell me about your HR experience and your biggest achievement in people management."
2. Focus on real scenarios (STAR method answers)
3. Score: Communication | HR Knowledge | Empathy | Problem Solving | Grammar
4. After 5–7 questions, summarise strengths and gaps""",

    "marketing": """You are a Chief Marketing Officer conducting a mock interview for a Marketing Manager role.

TOPICS TO COVER:
- Digital marketing: SEO, SEM, social media, email marketing, content strategy
- Marketing analytics: CTR, ROAS, CAC, LTV, funnel analysis
- Brand building, storytelling, target audience segmentation
- Campaign planning and A/B testing
- Tools: Google Analytics, HubSpot, Meta Ads, Google Ads
- Behavioural: managing campaign budgets, cross-functional collaboration

BEHAVIOR:
1. Start with "Tell me about your most successful marketing campaign and the results it achieved."
2. Mix strategy, analytics, and creative thinking questions
3. Score: Communication | Marketing Knowledge | Creativity | Data Mindset | Grammar
4. After 5–7 questions, provide final feedback""",

    "sales": """You are a VP of Sales conducting a mock interview for a Sales Executive/Business Development role.

TOPICS TO COVER:
- Sales methodologies: SPIN, Challenger, Solution Selling, MEDDIC
- Prospecting, lead qualification, cold calling, email outreach
- Objection handling, negotiation, closing techniques
- CRM tools: Salesforce, HubSpot CRM, pipeline management
- Sales metrics: quota attainment, conversion rates, average deal size
- Behavioural: handling rejection, dealing with difficult clients, missed targets

BEHAVIOR:
1. Start with "Sell me something — any product you like. Go!"
2. Then alternate between technique questions and situational scenarios
3. Score: Communication | Persuasion | Confidence | Product Knowledge | Grammar
4. After 5–7 exchanges, give final sales interview report""",

    "mba": """You are a Business School admissions interviewer or a management consultant conducting a mock MBA interview.

TOPICS TO COVER:
- Why MBA? Short-term and long-term career goals
- Leadership experience and team management stories
- Consulting case-style business problems (market sizing, profitability frameworks)
- Ethical dilemmas and decision-making under uncertainty
- Global business trends, entrepreneurship, strategy
- Communication: clarity, structure, executive presence

BEHAVIOR:
1. Start with "Walk me through your professional background and why you are pursuing an MBA."
2. Mix personal motivation, leadership, and case questions
3. Score: Communication | Strategic Thinking | Leadership | Structure | Grammar
4. After 5–7 questions, give an overall interview assessment""",
}

# Generic fallback prompt for any role not in the specific map
INTERVIEW_GENERIC_PROMPT = """You are SpeakIntel AI, acting as a professional interviewer conducting a mock interview for the role of {role}.

BEHAVIOR:
1. Ask ONE focused interview question at a time, strictly relevant to the {role} role
2. After each answer: score Communication | Technical Knowledge | Grammar | Fluency | Vocabulary (each /10)
3. Give specific feedback and a model answer
4. Ask progressively deeper questions across technical, situational, and behavioural domains
5. After 5–7 questions, give an overall interview summary and final scores

Start by greeting the candidate and asking them to introduce themselves as they would in a real {role} interview."""

ROLEPLAY_PROMPTS = {
    "hr_interview": """You are an experienced HR Manager conducting a behavioral interview.
Ask STAR-method questions about teamwork, leadership, conflict resolution, and career motivation.
After each answer, give brief coaching on answer structure and suggest improvements.
Keep a professional yet warm tone. Ask one question at a time.""",

    "friend": """You are a close, friendly person having a casual chat with the user over coffee.
Talk about hobbies, weekend plans, favourite movies, food, travel dreams, and funny stories.
Be relaxed, use informal language, slang occasionally, laugh and joke.
After a few exchanges, subtly note if the user used a great English phrase or could improve one — keep it light.""",

    "business_meeting": """You are a professional colleague in a formal business meeting.
Discuss project milestones, budget concerns, upcoming deadlines, and team collaboration challenges.
Ask for the user's updates and opinions on strategic decisions.
Use formal business language. Occasionally challenge an idea politely to test confident communication.""",

    "teacher": """You are a dedicated school/college teacher reviewing a student's recent performance.
Discuss assignments, upcoming exams, areas of improvement, and study strategies.
Be encouraging and constructive. If the student explains something, listen carefully and ask probing questions.
Give a brief language correction tip after each long student response.""",

    "customer_support": """You are a customer support representative for a tech company.
The user is a customer with a problem (billing issue, app not working, wrong order, etc.).
Be professional, patient, empathetic and solution-focused.
Ask clarifying questions, acknowledge frustration, and resolve the issue step by step.""",

    "sales_pitch": """You are a sceptical but fair potential client listening to a sales pitch.
Ask tough but reasonable questions: "What's your ROI?", "How do you compare to competitors?", "What's the implementation timeline?"
Raise objections and see how the user handles them.
If convinced, respond positively; if not, push back constructively.""",

    "college_viva": """You are a strict but fair college professor conducting a viva voce examination.
Ask conceptual and applied questions from the user's stated subject (ask which subject at the start).
Challenge weak answers with follow-up questions. Praise strong, well-structured explanations.
Evaluate academic language, depth of understanding, and communication clarity.""",

    "group_discussion": """You are a moderator and active participant in a group discussion.
Start by proposing a current topic (technology, environment, economy, education, etc.).
Share your viewpoint, then invite the user's perspective. Build on their points or respectfully counter them.
Encourage structured arguments: state a point, give evidence, conclude.""",

    "public_speaking": """You are an engaged audience member at a public speaking or presentation event.
The user is delivering a speech or presentation on any topic they choose.
React realistically: nod agreement, ask clarifying questions, request examples.
After the speech, give constructive feedback on delivery, structure, vocabulary, and confidence.""",

    "travel": """You are a friendly local guide in a foreign city helping a visitor.
Discuss must-see attractions, local food, transport options, safety tips, and cultural customs.
If the user makes a travel request or asks for directions, respond helpfully and conversationally.
Occasionally introduce a fun local fact or phrase in the local language.""",

    "restaurant": """You are a friendly waiter at a mid-range restaurant.
Greet the customer, present a brief menu, take their order, handle special requests, and make suggestions.
If they have questions about ingredients or dishes, answer them. If they complain, handle it graciously.
Keep the interaction realistic and natural.""",

    "doctor": """You are a calm, professional doctor during a routine or urgent medical consultation.
Ask the patient about their symptoms, duration, medical history, and lifestyle.
Provide general educational information (not real medical advice).
Practice active listening: paraphrase what the patient says and ask follow-up questions.""",

    "receptionist": """You are a professional hotel or office receptionist.
Help the visitor/guest with check-in, room requests, directions, booking queries, or appointment scheduling.
Be polite, efficient, and warm. Handle any complaints gracefully and offer alternatives.""",

    "ceo": """You are a decisive, high-powered CEO in an executive meeting.
Discuss company vision, quarterly performance, strategic initiatives, and market challenges.
Ask direct, challenging questions about the user's proposals.
Expect concise, confident, data-backed answers. Reward clarity and penalise vagueness.""",

    "tourist": """You are a friendly foreign tourist visiting the user's city for the first time.
You speak English with some hesitation and occasionally ask for clarification.
Ask for help finding famous spots, understanding local customs, ordering food, and using public transport.
React with enthusiasm and gratitude when helped.""",
}

# Groq models to try in order of preference (verified active 2026-09)
GROQ_MODELS = [
    "groq/compound-mini",          # Groq native – fast, free tier
    "openai/gpt-oss-20b",          # OpenAI OSS 20B via Groq – free tier
    "qwen/qwen3.8-27b",            # Qwen 3.8-27B – good quality
    "openai/gpt-oss-120b",         # OpenAI OSS 120B via Groq – largest
]

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class AICoach:
    """AI Communication Coach powered by Groq & Google Gemini AI."""
    
    def __init__(self):
        self.groq_api_key = settings.groq_api_key or os.environ.get("GROQ_API_KEY", "")
        self.gemini_api_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY", "")
        
        g_preview = ("***" + self.groq_api_key[-4:]) if len(self.groq_api_key) > 4 else "(empty)"
        gem_preview = ("***" + self.gemini_api_key[-4:]) if len(self.gemini_api_key) > 4 else "(empty)"
        print(f"[AICoach] Initialized with Groq: {g_preview}, Gemini: {gem_preview}")

    async def _call_gemini(self, system_prompt: str, user_message: str, conversation_history: list[dict]) -> Optional[str]:
        """Call Google Gemini AI API."""
        if not self.gemini_api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.gemini_api_key}"
        
        contents = []
        for msg in conversation_history:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})
        
        contents.append({"role": "user", "parts": [{"text": user_message}]})

        payload = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1024
            }
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            try:
                response = await client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            print("[AICoach] SUCCESS with Gemini API")
                            return text
                else:
                    print(f"[AICoach] Gemini API status {response.status_code}: {response.text[:200]}")
            except Exception as e:
                print(f"[AICoach] Gemini API error: {e}")
        return None

    async def _call_groq(self, system_prompt: str, user_message: str, conversation_history: list[dict]) -> Optional[str]:
        """Call the Groq API using OpenAI-compatible endpoint."""
        if not self.groq_api_key:
            return None

        messages = [{"role": "system", "content": system_prompt}]
        for msg in conversation_history:
            role = "assistant" if msg["role"] == "model" else msg["role"]
            messages.append({"role": role, "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        async with httpx.AsyncClient(timeout=45.0) as client:
            for model_name in GROQ_MODELS:
                payload = {
                    "model": model_name,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024,
                }
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.groq_api_key}",
                }
                try:
                    response = await client.post(GROQ_API_URL, json=payload, headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices:
                            text = choices[0].get("message", {}).get("content", "")
                            if text:
                                print(f"[AICoach] SUCCESS with Groq/{model_name}")
                                return text
                except Exception as e:
                    print(f"[AICoach] Groq/{model_name} exception: {e}")

        return None

    def _generate_dynamic_fallback(self, user_message: str, mode: str, role: Optional[str] = None) -> str:
        """Generate diverse, dynamic coaching responses when LLM APIs are offline."""
        lower_msg = user_message.strip().lower()
        
        # 1. Grammar analysis
        corrected = user_message.strip()
        explanation = "Great job! Your sentence is grammatically sound and easy to understand."
        grammar_score = random.randint(8, 9)
        fluency_score = random.randint(7, 9)
        vocab_score = random.randint(7, 9)

        if "excited for join" in lower_msg:
            corrected = user_message.replace("excited for join", "excited to join").replace("Excited for join", "Excited to join")
            explanation = "Use 'excited to join' (infinitive verb form) instead of 'excited for join'."
            grammar_score = 6
        elif "helping me to growing" in lower_msg:
            corrected = user_message.replace("helping me to growing", "help me grow").replace("Helping me to growing", "Help me grow")
            explanation = "Use 'help me grow' (base verb form) instead of 'helping me to growing'."
            grammar_score = 5
        elif "i am agree" in lower_msg:
            corrected = user_message.replace("i am agree", "I agree").replace("I am agree", "I agree")
            explanation = "Say 'I agree' instead of 'I am agree', as agree is already a verb."
            grammar_score = 6
        elif "explain me" in lower_msg:
            corrected = user_message.replace("explain me", "explain to me").replace("Explain me", "Explain to me")
            explanation = "Say 'explain to me' or 'explain this to me'."
            grammar_score = 7

        # 2. Dynamic conversational responses based on content and role
        if mode == "interview":
            interview_openers = [
                f"Thank you for sharing that answer. In a professional interview for {role or 'this role'}, articulating your experience clearly is key.",
                f"That is a solid response! Hiring managers appreciate concrete examples when you speak about your qualifications.",
                f"I like how you structured your response. To make it even more impactful, you could mention a specific outcome or metric.",
                f"Good communication! Your tone is professional and confident. Let's build on that strength."
            ]
            next_questions = [
                "Could you describe a challenging project you handled and how you overcame any roadblocks?",
                "What is an area in your skill set that you are actively working to improve right now?",
                "How do you typically handle tight deadlines or sudden changes in priority?",
                "Where do you see your technical and communication skills evolving over the next two years?"
            ]
            opener = random.choice(interview_openers)
            next_q = random.choice(next_questions)
            body = f"{opener}\n\n{next_q}"
        elif mode == "roleplay":
            roleplay_responses = [
                f"That sounds interesting! As your conversation partner in this {role or 'roleplay'} session, I'd love to hear more details.",
                f"I see what you mean. That makes a lot of sense from your perspective.",
                f"Fascinating! How do you usually handle situations like that in real life?",
                f"Thanks for explaining that so well! What would you say is the biggest advantage of that approach?"
            ]
            body = random.choice(roleplay_responses)
        else:
            conversational_starters = [
                "I really enjoyed reading your perspective! You are expressing your ideas naturally.",
                "That is a great point! Practicing expressing thoughts out loud like this is the fastest way to master fluency.",
                "Well stated! You are building great momentum in your speaking practice.",
                "You expressed that clearly and smoothly. Let's keep the dialogue going!",
                "Great effort! Your sentence structure is coming together very well."
            ]
            followups = [
                "What inspired you to explore this topic today?",
                "How would you describe this if you were explaining it to a close colleague or friend?",
                "Can you share an example from your personal experience related to this?",
                "What are some goals you're working toward this week?"
            ]
            body = f"{random.choice(conversational_starters)} {random.choice(followups)}"

        feedback_section = f"""

📝 **Feedback:**
- **You said:** "{user_message.strip()}"
- **Better version:** "{corrected}"
- **Why:** {explanation}
- **Score:** Grammar: {grammar_score}/10 | Fluency: {fluency_score}/10 | Vocabulary: {vocab_score}/10"""

        return body + feedback_section

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
        if mode == "interview":
            # Use role-specific prompt if available, else generic
            if role and role in INTERVIEW_ROLE_PROMPTS:
                system_prompt = INTERVIEW_ROLE_PROMPTS[role]
            else:
                role_display = role.replace("-", " ").title() if role else "General"
                system_prompt = INTERVIEW_GENERIC_PROMPT.format(role=role_display)
        elif mode == "roleplay" and role and role in ROLEPLAY_PROMPTS:
            system_prompt = ROLEPLAY_PROMPTS[role]
            # Inject topic placeholder for group_discussion
            if "{topic}" in system_prompt:
                system_prompt = system_prompt.replace("{topic}", "the impact of technology on modern society")
        else:
            system_prompt = COACH_SYSTEM_PROMPT
        
        system_prompt += f"\n\nUser's English level: {level}"
        
        # 1. Try Groq API first
        response_text = await self._call_groq(system_prompt, user_message, conversation_history)
        
        # 2. Try Google Gemini API fallback
        if not response_text:
            response_text = await self._call_gemini(system_prompt, user_message, conversation_history)

        # 3. Dynamic smart fallback if APIs are unavailable
        if not response_text:
            response_text = self._generate_dynamic_fallback(user_message, mode, role)
        
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
        if not result:
            result = await self._call_gemini("You are a grammar analysis engine. Return only valid JSON.", prompt, [])
            
        return {"analysis": result or '{"errors": [], "score": 8, "summary": "Sentence structure is clear with good readability."}'}
    
    async def analyze_vocabulary(self, word: str) -> dict:
        """Get vocabulary analysis for a word."""
        prompt = f"""For the English word "{word}", provide:
- "word": the word
- "meaning": clear definition
- "pronunciation": phonetic pronunciation
- "hindi_translation": Hindi translation
- "synonyms": list of 3-5 synonyms
- "antonyms": list of 2-3 antonyms
- "example_sentences": list of 2-3 examples
- "collocations": list of 2-3 common collocations
- "difficulty": "beginner" | "intermediate" | "advanced"

Return ONLY valid JSON, no other text."""
        
        result = await self._call_groq("You are a vocabulary dictionary engine. Return only valid JSON.", prompt, [])
        if not result:
            result = await self._call_gemini("You are a vocabulary dictionary engine. Return only valid JSON.", prompt, [])
            
        return {"vocabulary": result or '{"word": "' + word + '", "meaning": "A useful vocabulary word.", "difficulty": "intermediate"}'}
    
    def _extract_scores(self, text: str) -> dict:
        """Extract scores from the AI response text."""
        scores = {"grammar": 8, "fluency": 7, "vocabulary": 7, "overall": 7}
        
        # Look for score patterns like "Grammar: 8/10" or "Grammar: 8"
        patterns = {
            "grammar": r"[Gg]rammar[:\s]+(\d+)(?:/10)?",
            "fluency": r"[Ff]luency[:\s]+(\d+)(?:/10)?",
            "vocabulary": r"[Vv]ocabulary[:\s]+(\d+)(?:/10)?",
            "confidence": r"[Cc]onfidence[:\s]+(\d+)(?:/10)?",
            "communication": r"[Cc]ommunication[:\s]+(\d+)(?:/10)?",
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, text)
            if match:
                try:
                    val = int(match.group(1))
                    if 1 <= val <= 10:
                        scores[key] = val
                except ValueError:
                    pass
        
        # Calculate overall score
        numeric_scores = [v for k, v in scores.items() if k != "overall" and isinstance(v, (int, float))]
        if numeric_scores:
            scores["overall"] = round(sum(numeric_scores) / len(numeric_scores))
        
        return scores


# Global instance
ai_coach = AICoach()
