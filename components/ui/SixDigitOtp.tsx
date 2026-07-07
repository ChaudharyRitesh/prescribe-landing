"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SixDigitOtpProps {
  onComplete?: (otp: string) => void;
  onResend?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export function SixDigitOtp({
  onComplete,
  onResend,
  onClose,
  isLoading,
  error,
  success
}: SixDigitOtpProps) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const submittedOtpRef = useRef("");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (canResend) {
      setOtp("");
      submittedOtpRef.current = "";
      setTimer(30);
      setCanResend(false);
      onResend?.();
    }
  };

  const handleChange = (value: string) => {
    const nextOtp = value.replace(/\D/g, "").slice(0, 6);

    setOtp(nextOtp);

    if (nextOtp.length < 6) {
      submittedOtpRef.current = "";
      return;
    }

    if (!isLoading && !success && submittedOtpRef.current !== nextOtp) {
      submittedOtpRef.current = nextOtp;
      onComplete?.(nextOtp);
    }
  };

  useEffect(() => {
    if (error) submittedOtpRef.current = "";
  }, [error]);

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleChange(event.clipboardData.getData("text"));
  };

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-5 shadow-2xl sm:p-10">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-10 text-center"
      >
        <div className="w-20 h-20 bg-[#0D9488]/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <motion.div
            animate={success ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
          >
            {success ? (
              <CheckCircle2 className="w-10 h-10 text-[#0D9488]" />
            ) : error ? (
              <AlertCircle className="w-10 h-10 text-red-500" />
            ) : (
              <ShieldCheck className={cn("w-10 h-10 text-[#0D9488]", isLoading && "animate-pulse")} />
            )}
          </motion.div>
        </div>
        <h3 className="text-3xl font-extrabold text-neutral-900 mb-2">Identity Verification</h3>
        <p className="text-neutral-500 text-base max-w-sm mx-auto">
          We've sent a 6-digit verification code to your registered device.
        </p>
      </motion.div>

      <div className="mb-10 w-full max-w-sm">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleChange}
          disabled={isLoading || success}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          onPaste={handlePaste}
          containerClassName="w-full justify-center"
        >
          <InputOTPGroup className="grid w-full grid-cols-6 gap-2 sm:gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={cn(
                  "h-14 w-full rounded-lg border-2 text-2xl font-bold transition-all duration-300 sm:h-20 sm:text-3xl",
                  otp.length === index ? "border-[#0D9488] ring-4 ring-[#0D9488]/10 scale-105" : "border-neutral-200",
                  success ? "border-green-500 bg-green-50" : error ? "border-red-500 bg-red-50" : "bg-neutral-50"
                )}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm font-semibold mb-8 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col gap-4 border-t border-neutral-100 pt-8">
        <button
          onClick={handleResend}
          disabled={!canResend || isLoading || success}
          className={cn(
            "text-base font-bold transition-all flex items-center justify-center gap-2 py-2 rounded-xl",
            canResend ? "text-[#0D9488] hover:bg-[#0D9488]/5" : "text-neutral-400 cursor-not-allowed"
          )}
        >
          {canResend ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Resend Code
            </>
          ) : (
            `Resend available in ${timer}s`
          )}
        </button>
      </div>

      {/* Premium Background Accents */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0D9488]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#14B8A6]/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
