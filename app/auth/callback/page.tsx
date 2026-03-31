"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Authentication Callback Handler
 * Acts as an intermediate landing page for all authentication-related
 * redirects from email links (e.g., password resets and email verification).
 */
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract parameters from the URL
    // These could vary based on whether we use Supabase, custom backend, or Firebase
    const type = searchParams.get("type");
    const token = searchParams.get("token");
    const code = searchParams.get("code");
    const next = searchParams.get("next");

    // Logic to handle password reset redirects
    // Standard format: ?type=recovery&token=... or ?type=reset&token=...
    if (type === "recovery" || type === "reset" || next?.includes("reset-password")) {
      const resetToken = token || code;
      
      if (resetToken) {
        // Redirect to the actual UI page for resetting password
        router.push(`/partner/reset-password?token=${resetToken}`);
      } else {
        // Falling back to login if token is missing
        router.push("/partner/login");
      }
    } else {
      // If we don't recognize the type, just send to login
      // Future-proofing: add logic here for 'verify-email', etc.
      router.push("/partner/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Visual Feedback for processing */}
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00DACC]/5 animate-pulse" />
          <Loader2 className="w-8 h-8 text-[#00DACC] animate-spin relative z-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verifying Link</h2>
        <p className="text-neutral-500 leading-relaxed max-w-[280px]">
          Please wait while we securely process your request and redirect you.
        </p>

        {/* Subtle decorative background elements */}
        <div className="fixed top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#00DACC]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#00DACC] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
