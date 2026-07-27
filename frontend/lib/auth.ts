import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
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
});
