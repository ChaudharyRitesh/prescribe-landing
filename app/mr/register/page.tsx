"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseMedical, Building2, CheckCircle2, ChevronRight, Mail, Phone, User, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/axios";
import { useToast } from "@/hooks/use-toast";

export default function MRRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agency: "",
    territory: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic phone validation
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 8) {
        toast({
          title: "Registration Failed",
          description: "Phone number must be at least 8 digits with country code.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const response: any = await apiClient.post("/mr/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.agency,
        targetArea: formData.territory,
        password: formData.password,
      });

      if (response.success) {
        toast({
          title: "Registration Successful",
          description: "Your application has been submitted and is pending approval.",
        });
        // Redirect to login or show success state
        setTimeout(() => {
          router.push("/mr/login");
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
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
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#00DACC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 brightness-0 invert" />
            </span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-[#00DACC]">
              <span className="w-2 h-2 rounded-full bg-[#00DACC]" />
              MR Partner Program
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Empower Hospitals with <br /> <span className="text-[#00DACC]">KaeroPrescribe</span>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Join our network of elite medical representatives. Pitch our cutting-edge SaaS solution to hospitals and earn premium commissions while driving healthcare innovation.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-16 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span>High conversion premium SaaS product</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span>Industry-leading commission structure</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <CheckCircle2 className="w-5 h-5 text-[#00DACC]" />
              <span>Dedicated partner dashboard & territory management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative bg-white">
        <Link 
          href="/" 
          className="absolute top-6 left-6 md:hidden text-neutral-900 font-bold flex items-center gap-2"
        >
          <img src="/logo.png" alt="Logo" className="h-6" />
        </Link>
        
        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Apply as MR Partner</h2>
            <p className="text-neutral-500">Enter your details to register and access the MR dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-neutral-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="agency" className="text-sm font-medium text-neutral-700">Agency / Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="agency"
                  required
                  value={formData.agency}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                  placeholder="Pharma Sales Corp"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="territory" className="text-sm font-medium text-neutral-700">Target Territory / City</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseMedical className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="territory"
                  required
                  value={formData.territory}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#00DACC]/50 focus:border-[#00DACC] placeholder-neutral-400 sm:text-sm transition-shadow outline-none"
                  placeholder="e.g. New York Region"
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
                  minLength={8}
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
              <p className="text-[10px] text-neutral-500">Minimum 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#051114] hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00DACC] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Registering..." : (
                <>
                  Register & Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Link href="/mr/login" className="text-[#00DACC] font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>

            <p className="text-center text-[10px] text-neutral-500 mt-4 leading-relaxed">
              By registering, you agree to our <Link href="/terms" className="text-neutral-900 font-medium hover:text-[#00DACC] transition-colors">Terms of Service</Link> & <Link href="/privacy-policy" className="text-neutral-900 font-medium hover:text-[#00DACC] transition-colors">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
