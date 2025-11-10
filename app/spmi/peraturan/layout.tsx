import { ReactNode } from "react";

export default function PeraturanLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-900/20">
      {children}
    </div>
  );
}
