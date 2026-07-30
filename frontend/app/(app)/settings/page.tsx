"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Volume2, Globe, Bell, Shield, Palette, Save } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [aiVoice, setAiVoice] = useState("alloy");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="space-y-8 pb-20 lg:pb-0 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your experience
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary-light" />
          Appearance
        </h2>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!mounted || isDark ? <Moon className="w-5 h-5 text-primary-light" /> : <Sun className="w-5 h-5 text-amber-400" />}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Use dark theme</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            disabled={!mounted}
            className={`w-12 h-6 rounded-full transition-all relative cursor-pointer disabled:opacity-50 ${
              !mounted || isDark ? "bg-primary" : "bg-white/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                !mounted || isDark ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Voice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary-light" />
          Voice Settings
        </h2>

        {/* Voice Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm">Voice Speed</p>
            <span className="text-sm text-primary-light">{voiceSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSpeed}
            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* AI Voice */}
        <div>
          <p className="text-sm mb-2">AI Voice</p>
          <div className="grid grid-cols-3 gap-2">
            {["alloy", "echo", "shimmer"].map((voice) => (
              <button
                key={voice}
                onClick={() => setAiVoice(voice)}
                className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${
                  aiVoice === voice
                    ? "gradient-primary text-white"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {voice}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary-light" />
          Language
        </h2>
        <div>
          <p className="text-sm mb-2">Interface Language</p>
          <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-light" />
          Notifications
        </h2>

        {[
          { label: "Push Notifications", desc: "Receive notifications", state: notifications, setter: setNotifications },
          { label: "Daily Reminder", desc: "Remind to practice daily", state: dailyReminder, setter: setDailyReminder },
          { label: "Weekly Report", desc: "Get weekly progress report", state: weeklyReport, setter: setWeeklyReport },
        ].map((setting) => (
          <div key={setting.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.desc}</p>
            </div>
            <button
              onClick={() => setting.setter(!setting.state)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                setting.state ? "bg-primary" : "bg-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                  setting.state ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-light" />
          Privacy
        </h2>

        <div className="space-y-3">
          <button className="text-sm text-muted-foreground hover:text-white transition-colors">
            Download My Data
          </button>
          <br />
          <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <button className="btn-primary w-full flex items-center justify-center gap-2">
        <Save className="w-4 h-4" />
        Save Settings
      </button>
    </div>
  );
}
