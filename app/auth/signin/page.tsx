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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {/* Background Card */}
        <Card className="bg-white border border-gray-200 shadow-2xl">
          <CardBody className="p-8 md:p-10">
            {/* Logo/Header */}
            <div className="text-center mb-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue to LPMPP UNSOED
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-red-800 leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              size="lg"
              className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
              startContent={<GoogleIcon size={20} />}
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
            >
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Secure Authentication
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Protected by Google OAuth 2.0</span>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 LPMPP UNSOED. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
