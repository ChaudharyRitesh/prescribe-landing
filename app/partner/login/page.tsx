"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/axios";
import { toast } from "sonner";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response: any = await apiClient.post("/mr/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.requires2FA) {
        toast.info("Verification Required", {
          description: `Verification code sent to your ${response.type || 'email'}.`,
        });
        router.push(`/partner/verify-otp?email=${formData.email}&type=${response.type}&tempToken=${response.tempToken}`);
        return;
      }

      if (response.success) {
        // Store token
        localStorage.setItem("partner_token", response.token);
        localStorage.setItem("partner_user", JSON.stringify(response.user));
        
        // Set cookie for Next.js 16 proxy/middleware
        document.cookie = `partner_token=${response.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Strict`;
        
        toast.success("Login Successful", {
          description: `Welcome back, ${response.user.name}`,
        });
        
        router.push("/partner/dashboard");
      } else if (!response.requires2FA) {
        toast.error("Login Failed", {
          description: response.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (error: any) {
      toast.error("Login Error", {
        description: error.message || "Invalid credentials or account pending approval.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Left side - Decorative/Info */}
      <div className="hidden md:flex flex-col justify-between md:w-[42%] bg-[#051114] text-white p-12 lg:p-20 relative overflow-hidden">
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
              Welcome Back to the <br /> <span className="text-[#00DACC]">Partner Program</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Login to manage your hospital leads, track your commissions, and monitor your territory performance.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span className="font-medium">Real-time Lead Tracking & Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span className="font-medium">Direct Commission Settlement Portals</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span className="font-medium">24/7 Dedicated Partner Relations Support</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span className="font-medium">Advanced Territory Performance Insights</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Kaero Group. Empowering healthcare innovation.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-white">
        <Link 
          href="/" 
          className="absolute top-6 left-6 md:hidden text-neutral-900 font-bold flex items-center gap-2"
        >
          <img src="/logo.png" alt="Logo" className="h-6" />
        </Link>
        
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Partner Login</h2>
            <p className="text-neutral-500">Access your partner dashboard to track progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
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
                  className="block w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
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

            <div className="flex items-center justify-end">
              <Link href="/partner/forgot-password" className="text-sm text-neutral-500 hover:text-[#00DACC]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#051114] hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00DACC] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Logging in..." : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link href="/partner/register" className="text-[#00DACC] font-semibold hover:underline">
                  Join Partner Program
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
