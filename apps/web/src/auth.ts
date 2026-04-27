import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@luxe/database";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        if (
          email === process.env.ADMIN_EMAIL?.toLowerCase() &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin-user",
            email: process.env.ADMIN_EMAIL,
            name: "Admin",
            role: "admin",
          };
        }

        const customer = await prisma.customer.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            passwordHash: true,
          },
        });

        if (!customer?.passwordHash) {
          return null;
        }

        const isValid = await compare(password, customer.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: customer.id,
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          role: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "customer";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          typeof token.role === "string" ? token.role : "customer";
      }

      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "admin";
      }

      return true;
    },
  },
});
