import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // Izinkan auto-linking account dengan email yang sama
  // PENTING: Ini untuk allow admin login dengan provider berbeda
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      try {
        // Cek apakah user sudah ada di database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // SECURITY: Hanya izinkan user yang SUDAH TERDAFTAR di database
        if (!existingUser) {
          console.log(`❌ Login ditolak: ${user.email} tidak terdaftar di database`);
          return false;
        }

        // Hanya izinkan user dengan role ADMIN
        if (existingUser.role !== "ADMIN") {
          console.log(`❌ Login ditolak: ${user.email} bukan ADMIN`);
          return false;
        }

        // Update user info (nama dan foto) jika berubah
        if (existingUser.name !== user.name || existingUser.image !== user.image) {
          await prisma.user.update({
            where: { email: user.email },
            data: { 
              name: user.name,
              image: user.image,
            },
          });
        }

        console.log(`✅ Login berhasil: ${user.email}`);
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect ke admin panel setelah login
      if (url.startsWith("/auth/signin")) {
        return `${baseUrl}/admin`;
      }
      // Untuk logout, redirect ke signin
      if (url === baseUrl) {
        return `${baseUrl}/auth/signin`;
      }
      // Default: arahkan ke URL yang diminta atau admin
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/admin`;
    },
    async session({ session, user }) {
      // Tambahkan role ke session
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        });
        
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
