"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/axios";
import { useToast } from "@/hooks/use-toast";

export default function PartnerForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response: any = await apiClient.post("/mr/forgot-password", { email });
      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Email Sent",
          description: "Check your inbox for password reset instructions.",
        });
      } else {
        toast({
          title: "Request Failed",
          description: response.message || "Unable to process request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Request Error",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Left side - Decorative/Info */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#051114] text-white p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#00DACC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 brightness-0 invert" />
            </span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Forgot Your <br /> <span className="text-[#00DACC]">Password?</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              No worries! Enter the email address associated with your partner account and we'll send you a link to reset your password.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-white">
        <Link 
          href="/partner/login" 
          className="absolute top-10 left-10 text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
        
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Password Recovery</h2>
                <p className="text-neutral-500">We'll send you instructions to regain access.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#051114] hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00DACC] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      Send Reset Instructions
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Check Your Inbox</h2>
              <p className="text-neutral-500 mb-10 leading-relaxed">
                If an account exists for <span className="font-semibold text-neutral-900">{email}</span>, you will receive a password reset link shortly.
              </p>
              <Link 
                href="/partner/login" 
                className="block w-full py-4 bg-[#051114] text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg shadow-neutral-200"
              >
                Return to Login
              </Link>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 text-sm font-semibold text-[#00DACC] hover:underline"
              >
                Didn't receive email? Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
