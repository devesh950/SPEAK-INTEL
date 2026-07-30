"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, ShieldAlert, Search, RefreshCw, 
  Award, Flame, Mail, Calendar, UserCheck, AlertTriangle
} from "lucide-react";

interface DBUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  level: string;
  xp: number;
  coins: number;
  streak: number;
  github: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = session?.user?.email === "devshyadav8023@gmail.com";

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/users`, {
        headers: {
          "x-admin-email": session?.user?.email || ""
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }
    if (isAdmin) {
      fetchUsers();
    }
  }, [session, status, router]);

  if (status === "loading" || (session?.user && loading && users.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md glass-card p-8 border border-red-500/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600/10 to-pink-500/10 blur-xl opacity-60" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Unauthorized Access</h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              This area is restricted to system administrators only. Your account (<strong>{session?.user?.email || "Guest"}</strong>) does not have the necessary permissions.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 px-5 rounded-xl gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const term = search.toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(term) || false;
    const emailMatch = user.email.toLowerCase().includes(term);
    return nameMatch || emailMatch;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground mt-1">
            Manage user profiles and track social handle registrations
          </p>
        </motion.div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all text-sm font-medium text-white/95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 gradient-border flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Synced Users</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">{users.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-light" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 gradient-border flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Streaks</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">
              {users.filter(u => u.streak > 0).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 gradient-border flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social Handles Linked</p>
            <h3 className="text-3xl font-bold text-white mt-1.5">
              {users.filter(u => u.github || u.instagram || u.linkedin).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-cyan-400" />
          </div>
        </motion.div>
      </div>

      {/* Users Table section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card gradient-border p-6 relative overflow-hidden"
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-6 focus-within:border-primary/50 transition-all max-w-md">
          <Search className="w-4.5 h-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 outline-none w-full text-sm text-white placeholder-muted-foreground"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No users found matching your search.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4 text-center">XP / Coins</th>
                  <th className="pb-4 text-center">Streak</th>
                  <th className="pb-4">Social Handles</th>
                  <th className="pb-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-sm hover:bg-white/[0.01] transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} 
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10"
                        />
                        <div>
                          <p className="font-semibold text-white/95">{user.name || "New Learner"}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-light border border-primary/20 capitalize">
                            {user.level}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-white/80 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-primary-light" />
                          <span className="font-bold text-white/90">{user.xp}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{user.coins} coins</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{user.streak} days</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        {user.github ? (
                          <a 
                            href={user.github.startsWith("http") ? user.github : `https://github.com/${user.github}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-all"
                            title="GitHub"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                              <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                          </a>
                        ) : (
                          <span className="w-8 h-8 rounded-lg bg-white/[0.01] border border-dashed border-white/[0.05] flex items-center justify-center text-white/10 select-none">-</span>
                        )}

                        {user.instagram ? (
                          <a 
                            href={user.instagram.startsWith("http") ? user.instagram : `https://instagram.com/${user.instagram}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-pink-500/70 hover:text-pink-400 transition-all"
                            title="Instagram"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          </a>
                        ) : (
                          <span className="w-8 h-8 rounded-lg bg-white/[0.01] border border-dashed border-white/[0.05] flex items-center justify-center text-white/10 select-none">-</span>
                        )}

                        {user.linkedin ? (
                          <a 
                            href={user.linkedin.startsWith("http") ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-blue-400/70 hover:text-blue-400 transition-all"
                            title="LinkedIn"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        ) : (
                          <span className="w-8 h-8 rounded-lg bg-white/[0.01] border border-dashed border-white/[0.05] flex items-center justify-center text-white/10 select-none">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
