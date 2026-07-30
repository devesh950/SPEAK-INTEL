import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpeakIntel AI - Your Personal AI Communication Coach",
  description:
    "Master English communication with AI. Practice real conversations with your personal AI coach that listens, corrects, scores, and helps you become fluent.",
  keywords: [
    "AI communication coach",
    "English speaking practice",
    "interview preparation",
    "pronunciation trainer",
    "grammar coach",
    "vocabulary builder",
  ],
  openGraph: {
    title: "SpeakIntel AI - Master English Communication with AI",
    description:
      "Practice real conversations with your personal AI coach that listens, corrects, scores, and helps you become fluent.",
    type: "website",
  },
};

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
