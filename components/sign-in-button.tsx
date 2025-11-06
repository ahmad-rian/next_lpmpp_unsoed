"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { UserIcon, ArrowRightIcon } from "@/components/icons";

export function SignInButton() {
  return (
    <Button
      as={Link}
      href="/auth/signin"
      color="primary"
      variant="shadow"
      startContent={<UserIcon size={18} />}
      endContent={<ArrowRightIcon size={16} />}
    >
      Sign In
    </Button>
  );
}
