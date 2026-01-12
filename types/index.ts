import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      isActive: boolean;
      roles: string[];
      permissions: string[];
      // Backward compatibility: computed "role" that returns "ADMIN" if user has any role
      role: "USER" | "ADMIN";
    };
  }

  interface User {
    isActive?: boolean;
    roles?: string[];
    permissions?: string[];
    role?: "USER" | "ADMIN";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    role?: "USER" | "ADMIN";
  }
}
