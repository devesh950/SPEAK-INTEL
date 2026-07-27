"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code,
  Database,
  Brain,
  Users,
  Briefcase,
  TrendingUp,
  Target,
  GraduationCap,
  Layout,
  Server,
  ArrowRight,
  Search,
} from "lucide-react";

const roles = [
  { id: "software-engineer", title: "Software Engineer", icon: Code, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", difficulty: "Advanced" },
  { id: "data-analyst", title: "Data Analyst", icon: Database, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", difficulty: "Intermediate" },
  { id: "data-scientist", title: "Data Scientist", icon: Brain, color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400", difficulty: "Advanced" },
  { id: "product-manager", title: "Product Manager", icon: Target, color: "from-pink-500/20 to-pink-600/5", iconColor: "text-pink-400", difficulty: "Advanced" },
  { id: "hr", title: "HR", icon: Users, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400", difficulty: "Intermediate" },
  { id: "marketing", title: "Marketing", icon: TrendingUp, color: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-400", difficulty: "Intermediate" },
  { id: "sales", title: "Sales", icon: Briefcase, color: "from-orange-500/20 to-orange-600/5", iconColor: "text-orange-400", difficulty: "Intermediate" },
  { id: "mba", title: "MBA", icon: GraduationCap, color: "from-indigo-500/20 to-indigo-600/5", iconColor: "text-indigo-400", difficulty: "Advanced" },
  { id: "frontend-developer", title: "Frontend Developer", icon: Layout, color: "from-rose-500/20 to-rose-600/5", iconColor: "text-rose-400", difficulty: "Intermediate" },
  { id: "backend-developer", title: "Backend Developer", icon: Server, color: "from-teal-500/20 to-teal-600/5", iconColor: "text-teal-400", difficulty: "Advanced" },
];

export default function InterviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = roles.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Mock Interview</h1>
        <p className="text-muted-foreground mt-1">
          Practice interviews for your dream role
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
        />
      </div>

      {/* Resume Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 gradient-border"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">📄 Resume-Based Interview</h3>
            <p className="text-sm text-muted-foreground">
              Upload your resume and get interview questions tailored to your experience.
            </p>
          </div>
          <button className="btn-primary text-sm whitespace-nowrap">
            Upload Resume
          </button>
        </div>
      </motion.div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/conversation?mode=interview&role=${role.id}`}>
              <div className="glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${role.iconColor}`}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      role.difficulty === "Advanced" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {role.difficulty}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1">{role.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Interview <ArrowRight className="w-3 h-3" />
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
