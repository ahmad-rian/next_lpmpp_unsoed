"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-20 h-10 bg-default-100 animate-pulse rounded-lg" />
    );
  }

  return session?.user ? <SignOutButton /> : <SignInButton />;
}
