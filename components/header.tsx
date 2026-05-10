"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for cookie on mount
    const hasToken = document.cookie.split(';').some((item) => item.trim().startsWith('partner_token='));
    setIsLogged(hasToken);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie = "partner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem("partner_token");
      window.location.href = "/partner/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { label: "Modules", href: "/#modules" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Compliance", href: "/compliance" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-100">
      <div className="section-max-width px-4 sm:px-6 md:px-8 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="KaeroPrescribe Logo"
              className="object-cover w-32 xs:w-36 sm:w-44 md:w-52 lg:w-60 h-full"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-neutral-600 text-sm font-medium transition-colors hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLogged ? (
            <>
              <Link
                href="/partner/dashboard"
                className="text-neutral-600 text-sm font-medium transition-colors hover:text-neutral-900 flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="button-primary text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/partner/register"
                className="text-neutral-600 text-sm font-medium transition-colors hover:text-neutral-900 border border-neutral-200 px-4 py-2 rounded-full hidden lg:block"
              >
                Partner Program
              </Link>
              <Link href="/onboarding" className="button-primary text-sm">
                Create Account
              </Link>
              {/* <Link href="#" className="button-primary text-sm">
                Create Account
              </Link> */}
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 sm:px-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-neutral-600 font-medium transition-colors hover:text-neutral-900 py-2.5 text-base"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100 mt-2">
              {isLogged ? (
                <>
                  <Link href="/partner/dashboard" className="button-outline w-full text-sm text-center py-2 border rounded-full text-neutral-600 font-medium flex items-center justify-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="button-primary w-full text-sm text-center py-2 flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/partner/register" className="button-outline w-full text-sm text-center py-2 border rounded-full text-neutral-600 font-medium">
                    Partner Program
                  </Link>
                  <Link href="/onboarding" className="button-primary w-full text-sm text-center py-2">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
