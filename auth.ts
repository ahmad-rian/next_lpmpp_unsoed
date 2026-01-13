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
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        // SECURITY: Hanya izinkan user yang SUDAH TERDAFTAR di database
        if (!existingUser) {
          console.log(`❌ Login ditolak: ${user.email} tidak terdaftar di database`);
          return false;
        }

        // Check if user is active
        if (!existingUser.isActive) {
          console.log(`❌ Login ditolak: ${user.email} tidak aktif`);
          return false;
        }

        // Check if user has any role (at least one role required to login)
        if (existingUser.roles.length === 0) {
          console.log(`❌ Login ditolak: ${user.email} tidak memiliki role`);
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
      // Redirect ke admin panel setelah login sukses
      if (url.startsWith("/auth/signin")) {
        return `${baseUrl}/admin`;
      }

      // Jika URL adalah baseUrl (homepage), biarkan redirect ke homepage
      if (url === baseUrl || url === `${baseUrl}/`) {
        return baseUrl;
      }

      // Jika URL internal lainnya, izinkan
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Fallback ke admin untuk URL external
      return `${baseUrl}/admin`;
    },
    async session({ session, token }) {
      // Tambahkan data dari token ke session (JWT strategy)
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.isActive = token.isActive as boolean;
        session.user.roles = (token.roles as string[]) || [];
        session.user.permissions = (token.permissions as string[]) || [];

        // Backward compatibility: set role to "ADMIN" if user has any role
        session.user.role = session.user.roles.length > 0 ? "ADMIN" : "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.isActive = dbUser.isActive;
          token.roles = dbUser.roles.map(ur => ur.role.name);

          // Extract unique permissions
          const permissions = new Set<string>();
          dbUser.roles.forEach(ur => {
            ur.role.permissions.forEach(rp => {
              permissions.add(rp.permission.name);
            });
          });
          token.permissions = Array.from(permissions);
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
    strategy: "jwt",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
