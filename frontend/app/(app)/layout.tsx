"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
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
  ShieldAlert,
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
  { icon: ShieldAlert, label: "Admin Console", href: "/admin" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Profile states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  // Initialize profile name and avatar
  const [profileName, setProfileName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  const presetAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  ];

  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      setAuthorized(true);
    } else {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status]);

  // Sync profile details with session or local state
  useEffect(() => {
    if (session?.user) {
      setProfileName(session.user.name || session.user.email?.split("@")[0] || "User");
      setProfileImage(session.user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User");
      
      // Sync Google profile on login
      if (session.user.email) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            github: localStorage.getItem("speakintel-github") || "",
            instagram: localStorage.getItem("speakintel-instagram") || "",
            linkedin: localStorage.getItem("speakintel-linkedin") || ""
          })
        }).catch(err => console.error("Error syncing profile:", err));
      }
    } else {
      // Fallback localstorage sync for demo flow
      const cachedName = localStorage.getItem("speakintel-username") || "Demo User";
      const cachedImage = localStorage.getItem("speakintel-avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=demo";
      setProfileName(cachedName);
      setProfileImage(cachedImage);
    }
    // Load social links
    setGithubUrl(localStorage.getItem("speakintel-github") || "");
    setInstagramUrl(localStorage.getItem("speakintel-instagram") || "");
    setLinkedinUrl(localStorage.getItem("speakintel-linkedin") || "");
  }, [session]);

  const handleOpenEditProfile = () => {
    setEditName(profileName);
    setEditImage(profileImage);
    setEditGithub(githubUrl);
    setEditInstagram(instagramUrl);
    setEditLinkedin(linkedinUrl);
    setProfileModalOpen(true);
    setDropdownOpen(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    localStorage.setItem("speakintel-username", editName);
    localStorage.setItem("speakintel-avatar", editImage);
    localStorage.setItem("speakintel-github", editGithub);
    localStorage.setItem("speakintel-instagram", editInstagram);
    localStorage.setItem("speakintel-linkedin", editLinkedin);
    
    setProfileName(editName);
    setProfileImage(editImage);
    setGithubUrl(editGithub);
    setInstagramUrl(editInstagram);
    setLinkedinUrl(editLinkedin);

    // Sync profile to database
    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: editName,
          image: editImage,
          github: editGithub,
          instagram: editInstagram,
          linkedin: editLinkedin
        })
      }).catch(err => console.error("Profile db sync failed:", err));
    }

    // If NextAuth session is loaded, try updating it dynamically
    if (session) {
      try {
        await updateSession({
          name: editName,
          image: editImage,
        });
      } catch (err) {
        console.warn("Session update failed (unsupported in some providers), local state preserved.");
      }
    }

    setProfileModalOpen(false);
  };

  const handleSignOutClick = async () => {
    localStorage.removeItem("speakintel-username");
    localStorage.removeItem("speakintel-avatar");
    
    // Call NextAuth signOut
    await signOut({ callbackUrl: "/sign-in" });
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-border glass-strong"
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence initial={false}>
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
          {navItems
            .filter((item) => item.href !== "/admin" || session?.user?.email === "deveshyadav8023@gmail.com")
            .map((item) => {
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
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-popover text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle & User Profile */}
        <div className="p-3 border-t border-border space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
              <div 
                onClick={handleOpenEditProfile}
                className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 cursor-pointer flex-shrink-0"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                    {profileName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{profileName}</p>
                <p className="text-xs text-muted-foreground truncate mb-1">{session?.user?.email || "Learner"}</p>
                {/* Social links row */}
                {(githubUrl || instagramUrl || linkedinUrl) && (
                  <div className="flex gap-1.5 mt-0.5">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="GitHub Profile"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </a>
                    )}
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="Instagram Profile"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="LinkedIn Profile"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-1">
            <button
              onClick={handleSignOutClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all ${
                sidebarOpen ? "w-full" : "justify-center w-11"
              }`}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all ml-auto hidden lg:block"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${
                  !sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-[#0e0e11] border-r border-border flex flex-col shadow-2xl"
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
                {navItems
                  .filter((item) => item.href !== "/admin" || session?.user?.email === "deveshyadav8023@gmail.com")
                  .map((item) => {
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

              <div className="p-3 border-t border-border space-y-3">
                <div 
                  onClick={handleOpenEditProfile}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
                    <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{profileName}</p>
                    <p className="text-xs text-muted-foreground truncate mb-1">{session?.user?.email || "Learner"}</p>
                    {/* Social links row */}
                    {(githubUrl || instagramUrl || linkedinUrl) && (
                      <div className="flex gap-1.5 mt-0.5">
                        {githubUrl && (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                              <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                          </a>
                        )}
                        {instagramUrl && (
                          <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          </a>
                        )}
                        {linkedinUrl && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleSignOutClick}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
                >
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

          <div className="flex items-center gap-3 relative">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>

            {/* User Avatar & Dropdown trigger */}
            <div 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer relative"
            >
              {profileImage ? (
                <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center text-sm font-bold text-white">
                  {profileName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-[#121215] p-2 shadow-xl z-40 text-sm"
                  >
                    <div className="p-3 border-b border-border">
                      <p className="font-semibold text-white truncate">{profileName}</p>
                      <p className="text-xs text-muted-foreground truncate">{session?.user?.email || "Learner"}</p>
                      {/* Social Links Row */}
                      {(githubUrl || instagramUrl || linkedinUrl) && (
                        <div className="flex gap-2 mt-2">
                          {githubUrl && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                              title="GitHub Profile"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                              </svg>
                            </a>
                          )}
                          {instagramUrl && (
                            <a
                              href={instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                              title="Instagram Profile"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                              </svg>
                            </a>
                          )}
                          {linkedinUrl && (
                            <a
                              href={linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                              title="LinkedIn Profile"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleOpenEditProfile}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        ✏️ Edit Profile Info
                      </button>
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full block text-left px-3 py-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        ⚙️ Preferences
                      </Link>
                    </div>
                    <div className="border-t border-border pt-1 mt-1">
                      <button
                        onClick={handleSignOutClick}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">{children}</main>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative z-10 w-full max-w-md bg-[#121215] border border-border rounded-2xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-lg font-bold text-white">Edit Profile Info</h3>
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Avatar Preview & Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Choose Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 flex-shrink-0">
                      <img src={editImage} alt="Edit Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-6 gap-2 flex-1">
                      {presetAvatars.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditImage(url)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                            editImage === url ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Avatar URL */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Custom Avatar Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
                  />
                </div>

                {/* Display Name */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    GitHub Profile Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
                  />
                </div>

                {/* Instagram URL */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    Instagram Profile Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
                  />
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                    LinkedIn Profile Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-light transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border shadow-lg">
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
