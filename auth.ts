import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV !== "production",
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback started for:", user.email);

      if (!user.email) {
        console.log("❌ No email provided");
        return false;
      }

      try {
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

        if (!existingUser) {
          console.log(`❌ Login ditolak: ${user.email} tidak terdaftar di database`);
          return false;
        }

        if (!existingUser.isActive) {
          console.log(`❌ Login ditolak: ${user.email} tidak aktif`);
          return false;
        }

        if (existingUser.roles.length === 0) {
          console.log(`❌ Login ditolak: ${user.email} tidak memiliki role`);
          return false;
        }

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
        console.error("❌ SignIn error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/auth/signin")) {
        return `${baseUrl}/admin`;
      }
      if (url === baseUrl || url === `${baseUrl}/`) {
        return baseUrl;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/admin`;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.isActive = token.isActive as boolean;
        session.user.roles = (token.roles as string[]) || [];
        session.user.permissions = (token.permissions as string[]) || [];
        // ADMIN only for real admin-tier roles, not any role (prevents privilege escalation)
        const ADMIN_ROLES = ["super-admin", "admin", "editor"];
        session.user.role = session.user.roles.some((r) => ADMIN_ROLES.includes(r))
          ? "ADMIN"
          : "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        try {
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

            const permissions = new Set<string>();
            dbUser.roles.forEach(ur => {
              ur.role.permissions.forEach(rp => {
                permissions.add(rp.permission.name);
              });
            });
            token.permissions = Array.from(permissions);
          }
        } catch (error) {
          console.error("❌ JWT callback error:", error);
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
  logger: {
    // Log only the error code — never the message payload, which can contain
    // tokens/secrets/session data.
    error(code) {
      console.error("AUTH ERROR:", code);
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
