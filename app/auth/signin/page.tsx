"use client";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { GoogleIcon } from "@/components/icons";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "Email ini sudah terdaftar dengan metode login lain. Silakan gunakan metode login yang sama seperti sebelumnya.";
      case "OAuthSignin":
      case "OAuthCallback":
        return "Terjadi kesalahan saat login dengan Google. Silakan coba lagi.";
      case "AccessDenied":
        return "Akses ditolak. Anda tidak memiliki izin untuk mengakses aplikasi ini.";
      case "Verification":
        return "Token verifikasi tidak valid atau sudah kedaluwarsa.";
      default:
        return error ? "Terjadi kesalahan saat login. Silakan coba lagi." : null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardBody className="p-8 md:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src="/assets/images/logo.webp"
                  alt="LPMPP UNSOED"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-3 text-default-500">
              Sign in to continue to LPMPP UNSOED
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-800 dark:text-red-200">
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <Button
            size="lg"
            className="w-full bg-white dark:bg-gray-800 border-2 border-default-200 hover:border-red-500 hover:scale-[1.02] transition-all"
            startContent={<GoogleIcon size={24} />}
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
          >
            <span className="text-default-700 dark:text-default-300 font-semibold">
              Continue with Google
            </span>
          </Button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-default-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-content1 text-default-400">
                Secure Authentication
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-default-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-default-500">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Protected by Google OAuth 2.0</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
