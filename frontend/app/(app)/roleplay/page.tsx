"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Building2,
  GraduationCap,
  Headphones,
  Megaphone,
  BookOpen,
  MessageCircle,
  Mic2,
  Plane,
  UtensilsCrossed,
  Stethoscope,
  Hotel,
  Crown,
  Globe,
  ArrowRight,
} from "lucide-react";

const modes = [
  { id: "hr_interview", title: "HR Interview", icon: Briefcase, description: "Practice behavioral interview questions", color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400", category: "Professional" },
  { id: "friend", title: "Friend Chat", icon: Users, description: "Casual conversation practice", color: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-400", category: "Casual" },
  { id: "business_meeting", title: "Business Meeting", icon: Building2, description: "Formal business discussions", color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", category: "Professional" },
  { id: "teacher", title: "Teacher", icon: GraduationCap, description: "Academic discussions", color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", category: "Academic" },
  { id: "customer_support", title: "Customer Support", icon: Headphones, description: "Handle customer queries", color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400", category: "Professional" },
  { id: "sales_pitch", title: "Sales Pitch", icon: Megaphone, description: "Pitch products and services", color: "from-pink-500/20 to-pink-600/5", iconColor: "text-pink-400", category: "Professional" },
  { id: "college_viva", title: "College Viva", icon: BookOpen, description: "Academic viva voce exam", color: "from-indigo-500/20 to-indigo-600/5", iconColor: "text-indigo-400", category: "Academic" },
  { id: "group_discussion", title: "Group Discussion", icon: MessageCircle, description: "GD practice on various topics", color: "from-rose-500/20 to-rose-600/5", iconColor: "text-rose-400", category: "Academic" },
  { id: "public_speaking", title: "Public Speaking", icon: Mic2, description: "Practice speeches and presentations", color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-400", category: "Professional" },
  { id: "travel", title: "Travel", icon: Plane, description: "Conversations while traveling", color: "from-sky-500/20 to-sky-600/5", iconColor: "text-sky-400", category: "Casual" },
  { id: "restaurant", title: "Restaurant", icon: UtensilsCrossed, description: "Order food and interact with staff", color: "from-orange-500/20 to-orange-600/5", iconColor: "text-orange-400", category: "Casual" },
  { id: "doctor", title: "Doctor Visit", icon: Stethoscope, description: "Medical consultation practice", color: "from-red-500/20 to-red-600/5", iconColor: "text-red-400", category: "Casual" },
  { id: "receptionist", title: "Receptionist", icon: Hotel, description: "Hotel/office reception interaction", color: "from-teal-500/20 to-teal-600/5", iconColor: "text-teal-400", category: "Casual" },
  { id: "ceo", title: "CEO Meeting", icon: Crown, description: "High-stakes executive conversation", color: "from-yellow-500/20 to-yellow-600/5", iconColor: "text-yellow-400", category: "Professional" },
  { id: "tourist", title: "Foreign Tourist", icon: Globe, description: "Help a tourist navigate your city", color: "from-lime-500/20 to-lime-600/5", iconColor: "text-lime-400", category: "Casual" },
];

const categories = ["All", "Professional", "Casual", "Academic"];

export default function RoleplayPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Roleplay Modes</h1>
        <p className="text-muted-foreground mt-1">
          Practice English in real-world scenarios
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/10 transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Link href={`/conversation?mode=roleplay&role=${mode.id}`}>
              <div className="glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1 relative overflow-hidden h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${mode.iconColor}`}>
                      <mode.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                      {mode.category}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1">{mode.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{mode.description}</p>
                  <div className="flex items-center gap-1 text-xs text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Roleplay <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
