"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Mic,
  Briefcase,
  Users,
  Zap,
  BookOpen,
  Headphones,
  PenTool,
  BarChart3,
  Trophy,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Bell,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Mic, label: "Conversation", href: "/conversation" },
  { icon: Briefcase, label: "Interview", href: "/interview" },
  { icon: Users, label: "Roleplay", href: "/roleplay" },
  { icon: Zap, label: "Challenges", href: "/challenges" },
  { icon: BookOpen, label: "Vocabulary", href: "/vocabulary" },
  { icon: Headphones, label: "Pronunciation", href: "/pronunciation" },
  { icon: PenTool, label: "Grammar", href: "/grammar" },
  { icon: BarChart3, label: "Progress", href: "/progress" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-border"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold whitespace-nowrap overflow-hidden"
              >
                Speak<span className="text-primary">Intel</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative group ${
                  isActive
                    ? "bg-primary/15 text-primary-light font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary"
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-surface text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-all w-full"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                !sidebarOpen ? "rotate-180" : ""
              }`}
            />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 glass-strong border-r border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-4 h-16 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">
                    Speak<span className="text-primary">Intel</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-primary/15 text-primary-light font-medium"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-border">
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-[72px]"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold cursor-pointer">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "text-primary-light"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
