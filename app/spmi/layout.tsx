"use client";

import { useEffect, useState } from "react";
import { SpmiPasswordModal } from "@/components/spmi-password-modal";

export default function SpmiLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "open" | "locked" | "unlocked">("loading");

  const checkAccess = async () => {
    try {
      const response = await fetch("/api/spmi-auth");
      const data = await response.json();

      if (!data.protected) {
        setStatus("open");
      } else if (data.unlocked) {
        setStatus("unlocked");
      } else {
        setStatus("locked");
      }
    } catch {
      // If check fails, allow access rather than blocking
      setStatus("open");
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <>
        <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
        <SpmiPasswordModal
          isOpen={true}
          onSuccess={() => setStatus("unlocked")}
        />
      </>
    );
  }

  return <>{children}</>;
}
