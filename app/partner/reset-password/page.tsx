"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api/axios";
import { useToast } from "@/hooks/use-toast";

export default function PartnerResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await apiClient.post(`/mr/reset-password/${token}`, {
        password: formData.password,
      });

      if (response.success) {
        setIsSuccess(true);
        toast({
          title: "Password Reset Successfully",
          description: "You can now login with your new password.",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: response.message || "Unable to reset password. The link may be invalid.",
          variant: "destructive",
        });
        setError(response.message || "Reset link may be invalid or expired.");
      }
    } catch (error: any) {
      toast({
        title: "Reset Error",
        description: error.message || "Something went wrong. The link may have expired.",
        variant: "destructive",
      });
      setError(error.message || "Reset link may be invalid or expired.");
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
              Secure Your <br /> <span className="text-[#00DACC]">Partner Account.</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Create a strong, new password to protect your account and data. Use a combination of letters, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-white">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-[#00DACC]" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Set New Password</h2>
                <p className="text-neutral-500">Ensure your new password is secure and unique.</p>
              </div>

              {!token && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mb-6">
                  <p className="text-sm text-orange-800 font-medium">
                    No reset token found. Please make sure you clicked the link in your email correctly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-700">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full mt-4 py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#051114] hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00DACC] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Resetting Password..." : (
                    <>
                      Update Password
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#0D9488]" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Password Updated</h2>
              <p className="text-neutral-500 mb-10 leading-relaxed">
                Your password has been changed successfully. You can now use your new password to access your partner dashboard.
              </p>
              <Link 
                href="/partner/login" 
                className="block w-full py-4 bg-[#051114] text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-lg shadow-neutral-200"
              >
                Sign in to Partner Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
