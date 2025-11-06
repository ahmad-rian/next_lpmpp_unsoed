"use client";

export function PageTransition({ children }: { children: React.ReactNode }) {
  // Removed animation to make navigation faster
  return <>{children}</>;
}
