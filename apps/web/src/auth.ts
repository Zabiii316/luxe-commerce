import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          !email ||
          !password ||
          email !== process.env.ADMIN_EMAIL ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        return {
          id: "admin-user",
          email: process.env.ADMIN_EMAIL,
          name: "Admin",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          typeof token.role === "string" ? token.role : "admin";
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
});
