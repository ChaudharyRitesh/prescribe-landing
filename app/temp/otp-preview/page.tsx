"use client";

import { useState } from "react";
import { SixDigitOtp } from "@/components/ui/SixDigitOtp";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OtpPreviewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleComplete = (otp: string) => {
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otp === "123456") {
        setSuccess(true);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }, 2000);
  };

  const handleResend = () => {
    console.log("OTP Resent!");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0D9488]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link 
          href="/mr/dashboard" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[2rem] shadow-xl border border-neutral-100 text-center"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Verified Successfully</h2>
            <p className="text-neutral-500 mb-8 leading-relaxed text-lg">
              Your account has been successfully verified. You can now access all features of the MR Partner Portal.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="w-full py-4 bg-[#051114] text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg shadow-neutral-200"
            >
              Continue to Portal
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <SixDigitOtp 
              onComplete={handleComplete}
              onResend={handleResend}
              isLoading={loading}
              error={error}
              success={success}
            />
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-neutral-400 text-sm px-8 leading-relaxed"
            >
              For testing use code <span className="font-bold text-neutral-600 underline">123456</span> to see the success state. 
              Any other code will trigger an error animation.
            </motion.p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 w-full text-center">
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <img src="/logo.png" alt="Kaero Logo" className="h-4" />
          <span className="text-xs font-bold tracking-widest text-[#051114]">KAEROPRESCRIBE</span>
        </div>
      </div>
    </div>
  );
}
