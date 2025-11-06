"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardBody className="p-8 md:p-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <Image
                src="/assets/images/logo.webp"
                alt="LPMPP UNSOED"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Authentication Error
          </h2>
          <p className="text-default-600 mb-8 text-sm md:text-base">
            {error === "AccessDenied"
              ? "Akses ditolak. Hanya pengguna yang terdaftar yang dapat login ke sistem ini."
              : "Terjadi kesalahan saat autentikasi. Silakan coba lagi atau hubungi administrator."}
          </p>

          {/* Back Button */}
          <Button
            as={Link}
            href="/auth/signin"
            color="primary"
            variant="shadow"
            size="lg"
            className="w-full"
          >
            Kembali ke Halaman Login
          </Button>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-default-200">
            <p className="text-xs text-default-400">
              Butuh bantuan? Hubungi administrator sistem
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
