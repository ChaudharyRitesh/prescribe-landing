"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { SixDigitOtp } from "@/components/ui/SixDigitOtp";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

function PartnerVerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // These would be passed via search params or state management from login
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "email"; // 'email' or 'phone'
  const tempToken = searchParams.get("tempToken") || "";

  const handleComplete = async (otp: string) => {
    setLoading(true);
    setError("");

    try {
      const response: any = await apiClient.post("/mr/verify-2fa-login", {
        email,
        otp,
        tempToken,
        type
      });

      if (response.success) {
        setSuccess(true);
        // Store final tokens
        localStorage.setItem("partner_token", response.token);
        localStorage.setItem("partner_user", JSON.stringify(response.user));
        document.cookie = `partner_token=${response.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
        
        toast.success("Verification Successful", {
          description: "Welcome to your partner portal.",
        });

        // Small delay for success animation
        setTimeout(() => {
          router.push("/partner/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Invalid verification code. Please try again.");
        toast.error("Verification Failed", {
          description: response.message || "Invalid OTP",
        });
      }
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      toast.error("Verification Error", {
        description: error.message || "Something went wrong during verification.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiClient.post("/mr/send-verification-otp", { email, type, tempToken, isLogin: true });
      toast.success("OTP Resent", {
        description: `A new code has been sent to your ${type}.`,
      });
    } catch (error: any) {
      toast.error("Resend Failed", {
        description: error.message || "Unable to resend OTP.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0D9488]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/partner/login" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 font-medium group text-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          
          <div className="mb-2 flex justify-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center">
              {type === 'email' ? (
                <Mail className="w-6 h-6 text-[#0D9488]" />
              ) : (
                <Smartphone className="w-6 h-6 text-[#0D9488]" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Two-Factor Authentication</h1>
          <p className="text-neutral-500 text-sm mt-2 max-w-sm mx-auto">
            Please enter the 6-digit verification code sent to your registered {type}.
          </p>
        </div>

        <SixDigitOtp 
          onComplete={handleComplete}
          onResend={handleResend}
          isLoading={loading}
          error={error}
          success={success}
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default"
        >
          <img src="/logo.png" alt="Logo" className="h-4" />
          <span className="text-xs font-bold tracking-widest text-[#051114]">Partner PARTNER PORTAL</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function PartnerVerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PartnerVerifyOtpContent />
    </Suspense>
  );
}
