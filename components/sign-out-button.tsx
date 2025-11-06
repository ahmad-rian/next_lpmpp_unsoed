"use client";

import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button
      color="danger"
      variant="flat"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign Out
    </Button>
  );
}
