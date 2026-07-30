"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Brain,
  BookOpen,
  BarChart3,
  MessageSquare,
  Target,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  Sparkles,
  Zap,
  Trophy,
  Users,
  ArrowRight,
  Play,
  Menu,
  X,
  Globe,
  Shield,
  Headphones,
} from "lucide-react";

// ============================================
// NAVIGATION
// ============================================

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Speak<span className="text-primary">Intel</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Free Access", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link href="/sign-in" className="btn-primary text-sm !py-2 !px-5">
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {["Features", "How It Works", "Free Access", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-sm text-muted-foreground hover:text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link href="/sign-in" className="btn-secondary text-sm text-center">
                  Sign In
                </Link>
                <Link href="/sign-in" className="btn-primary text-sm text-center">
                  Start Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary-light" />
          <span className="text-sm text-muted-foreground">
            Powered by Google Gemini AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Master English{" "}
          <br className="hidden sm:block" />
          Communication{" "}
          <span className="gradient-text">with AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Practice real conversations with your personal AI coach that listens,
          corrects, scores, and helps you become fluent.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/sign-in"
            className="btn-primary text-base flex items-center gap-2 !px-8 !py-3.5"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="btn-secondary text-base flex items-center gap-2 !px-8 !py-3.5">
            <Play className="w-5 h-5" /> Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "2M+", label: "Conversations" },
            { value: "4.9", label: "App Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Animated Orb Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-orb-pulse" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-ping" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES SECTION
// ============================================

const features = [
  {
    icon: MessageSquare,
    title: "AI Conversations",
    description:
      "Practice real conversations with an AI that understands context, corrects mistakes, and adapts to your level.",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400",
  },
  {
    icon: Target,
    title: "Interview Practice",
    description:
      "Mock interviews for 10+ roles with AI evaluation of confidence, accuracy, and communication skills.",
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: BookOpen,
    title: "Grammar Coach",
    description:
      "Real-time grammar analysis with corrections, explanations, and personalized exercises.",
    color: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-400",
  },
  {
    icon: Headphones,
    title: "Pronunciation Trainer",
    description:
      "Compare your pronunciation with AI. Get feedback on stress, intonation, and accent patterns.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Brain,
    title: "Vocabulary Builder",
    description:
      "Learn new words with meanings, synonyms, translations, and example sentences in context.",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Beautiful charts and analytics showing your daily, weekly, and monthly improvement across all skills.",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-light uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Speak Confidently</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools for improving
            every aspect of your English communication.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative glass-card p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-default"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.iconColor}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS
// ============================================

const steps = [
  {
    step: "01",
    title: "Sign Up Free",
    description: "Create your account in seconds with Google sign-in.",
    icon: Users,
  },
  {
    step: "02",
    title: "Choose Your Mode",
    description:
      "Select from conversations, interviews, roleplay, or daily challenges.",
    icon: Globe,
  },
  {
    step: "03",
    title: "Practice with AI",
    description:
      "Speak naturally — our AI listens, responds, and coaches you in real time.",
    icon: Mic,
  },
  {
    step: "04",
    title: "Track Progress",
    description:
      "View detailed analytics, scores, and improvement trends over time.",
    icon: BarChart3,
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-light uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Start Improving in{" "}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="w-24 h-24 rounded-full glass mx-auto mb-6 flex items-center justify-center relative">
                <step.icon className="w-10 h-10 text-primary-light" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS
// ============================================

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    content:
      "SpeakIntel AI transformed my interview skills. I went from struggling with technical interviews to confidently landing a role at a top MNC. The real-time feedback is incredible!",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "MBA Student",
    content:
      "The roleplay modes are fantastic! Practicing business meetings and group discussions with AI helped me ace my MBA entrance interviews. Highly recommended!",
    rating: 5,
    avatar: "RV",
  },
  {
    name: "Anita Desai",
    role: "Marketing Manager",
    content:
      "I've tried many English learning apps, but SpeakIntel is the only one that actually feels like talking to a real coach. My confidence has improved dramatically.",
    rating: 5,
    avatar: "AD",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-light uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FREE ACCESS & SUPPORT
// ============================================

const freeFeatures = [
  "Unlimited AI conversations with immediate audio playback",
  "All 15 roleplay scenarios (Airport, Restaurant, Job Interview, etc.)",
  "Realistic mock interviews with instant performance grading",
  "Advanced pronunciation analyzer with phoneme-level checks",
  "Grammar trainer with detailed feedback & rules lookup",
  "Personalized vocabulary notebook & dashboard analytics",
];

function PricingSection() {
  return (
    <section id="free-access" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-light uppercase tracking-wider">
            Free Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Completely <span className="gradient-text">Free Forever</span>
          </h2>
          <p className="text-muted-foreground">
            No subscriptions. No credit cards. Get unlimited access to all features.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-primary/20 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden"
          >
            {/* Glowing border decoration */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/25 to-cyan-500/15 blur-lg opacity-40 -z-10" />

            <div className="flex-1 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  Unlimited Access
                </span>
                <h3 className="text-2xl font-bold text-white">All Premium Features Included</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Start practicing speaking, interview preparation, roleplay dialogue scenarios, and advanced pronunciation grading entirely for free.
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <Check className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">For support and help:</h4>
                  <a 
                    href="https://instagram.com/thesiddharthas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-pink-500/35 text-sm font-semibold text-white/90 hover:text-white transition-all group/inst"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 text-pink-500 group-hover/inst:scale-115 transition-all">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span>Connect with @thesiddharthas</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-center flex-shrink-0">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Practice Plan</span>
              <h2 className="text-5xl font-extrabold text-white mt-3">Free</h2>
              <p className="text-xs text-muted-foreground mt-2">No payment required. Ever.</p>
              
              <Link
                href="/sign-in"
                className="w-full mt-6 text-center text-sm font-bold py-3.5 px-6 rounded-xl btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer"
              >
                Get Started Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================

const faqs = [
  {
    q: "How does SpeakIntel AI help improve my English?",
    a: "SpeakIntel AI uses Google's Gemini AI to have natural conversations with you. It listens to what you say, evaluates your grammar, vocabulary, fluency, and confidence, and provides real-time corrections and suggestions. It's like having a personal English tutor available 24/7.",
  },
  {
    q: "Is there a free plan available?",
    a: "Yes! Our free plan includes 5 AI conversations per day, basic grammar feedback, 3 roleplay modes, and daily challenges. It's a great way to get started with no credit card required.",
  },
  {
    q: "What types of interviews can I practice?",
    a: "We offer mock interviews for 10+ roles including Software Engineer, Data Analyst, Product Manager, HR, Marketing, MBA, Frontend Developer, Backend Developer, and more. Each interview is tailored to the specific role with relevant questions.",
  },
  {
    q: "Can I use SpeakIntel AI on my phone?",
    a: "Absolutely! SpeakIntel AI is fully responsive and works beautifully on all devices — desktop, tablet, and mobile. We're also working on dedicated iOS and Android apps.",
  },
  {
    q: "How accurate is the pronunciation feedback?",
    a: "Our pronunciation trainer uses advanced speech analysis to compare your pronunciation with native speakers. It highlights incorrect words, stress patterns, intonation issues, and accent variations with a high degree of accuracy.",
  },
  {
    q: "Is my conversation data private?",
    a: "Yes, we take privacy seriously. Your conversations are encrypted and stored securely. We never share your personal data or conversation content with third parties. You can delete your data at any time from Settings.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary-light uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10">
            <Zap className="w-12 h-12 text-primary-light mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your{" "}
              <span className="gradient-text">Communication?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of learners who are already improving their English
              with SpeakIntel AI. Start your journey today — it&apos;s free!
            </p>
            <Link
              href="/sign-in"
              className="btn-primary text-base inline-flex items-center gap-2 !px-10 !py-4"
            >
              Start Free Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================

function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">SpeakIntel</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your Personal AI Communication Coach. Master English with
              confidence.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {["Features", "Free Access", "Interview Practice", "Roleplay Modes"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 SpeakIntel AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Secured & Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
