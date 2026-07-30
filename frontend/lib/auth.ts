import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import Credentials from "next-auth/providers/credentials";

// Sanitize environment variables to remove any accidental trailing newlines/whitespace (common when pasting into Vercel dashboard)
if (process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL.trim();
if (process.env.AUTH_URL) process.env.AUTH_URL = process.env.AUTH_URL.trim();
if (process.env.AUTH_SECRET) process.env.AUTH_SECRET = process.env.AUTH_SECRET.trim();
if (process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET.trim();
if (process.env.GOOGLE_CLIENT_ID) process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID.trim();
if (process.env.GOOGLE_CLIENT_SECRET) process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET.trim();
if (process.env.AUTH_GOOGLE_ID) process.env.AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID.trim();
if (process.env.AUTH_GOOGLE_SECRET) process.env.AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET.trim();

// Dynamic fallbacks for NextAuth v5 Edge/Serverless runtime configurations
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET || "speakintel_default_secret_fallback_key_2026";
}
if (!process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}
if (!process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
  process.env.AUTH_URL = "https://speak-intel.vercel.app";
} else if (process.env.NEXTAUTH_URL) {
  process.env.AUTH_URL = process.env.NEXTAUTH_URL;
}
if (!process.env.AUTH_GOOGLE_ID && process.env.GOOGLE_CLIENT_ID) {
  process.env.AUTH_GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
}
if (!process.env.AUTH_GOOGLE_SECRET && process.env.GOOGLE_CLIENT_SECRET) {
  process.env.AUTH_GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@speakintel.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Fallback demo user bypass: allow any login for dev/testing
        if (credentials?.email) {
          return {
            id: "demo-user-123",
            name: "Demo User",
            email: credentials.email as string,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "speakintel_default_secret_fallback_key_2026",
  trustHost: true,
  debug: true,
});
