"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "./brand-logo";

const navLinks = [
  { label: "Modules", href: "/#modules" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Compliance", href: "/compliance" },
];

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("partner_token="));
    setIsLogged(hasToken);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      setShowFab(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie =
        "partner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem("partner_token");
      window.location.href = "/partner/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#060B18]/85 shadow-[0_8px_24px_-12px_rgba(2,6,23,0.8)] backdrop-blur-xl"
            : "border-b border-transparent bg-[#060B18]/60 backdrop-blur"
        }`}
      >
        <div
          className={`lp-container flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20 md:h-24"
          }`}
        >
          {/* Brand lockup — teal mark + theme-colored wordmark */}
          <Link
            href="/"
            aria-label="KaeroPrescribe home"
            className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-85"
          >
            <BrandLogo mark={scrolled ? 38 : 46} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-3.5 -bottom-px h-px scale-x-0 bg-gradient-to-r from-teal-400 to-sky-400 transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isLogged ? (
              <>
                <Link
                  href="/partner/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-500"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(2,132,199,0.6)] transition-all duration-200 hover:bg-sky-500"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[19rem] max-w-[85vw] flex-col border-l border-white/10 bg-[#0A1326] shadow-2xl md:hidden"
              role="dialog"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <BrandLogo mark={36} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-teal-300"
                  >
                    {item.label}
                  </a>
                ))}
                {isLogged && (
                  <Link
                    href="/partner/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-base font-medium text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <LayoutDashboard size={18} className="text-slate-400" />
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="space-y-3 border-t border-white/10 p-4">
                {isLogged ? (
                  <button
                    onClick={handleLogout}
                    className="lp-btn-primary w-full cursor-pointer"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/onboarding"
                    onClick={() => setOpen(false)}
                    className="lp-btn-primary w-full"
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>
                )}
                <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-500">
                  <ShieldCheck size={14} className="text-teal-400" />
                  HIPAA &amp; DPDP compliant platform
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating mobile CTA after hero scroll */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:hidden"
          >
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-base font-bold text-white shadow-[0_16px_40px_-8px_rgba(2,132,199,0.7)]"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
