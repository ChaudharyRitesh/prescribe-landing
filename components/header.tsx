"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Compliance", href: "#compliance" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-100">
      <div className="section-max-width  py-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="text-xl font-semibold text-neutral-900 hidden sm:block">
            KaeroCare
          </span>
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
          <button className="button-secondary text-sm">Login</button>
          <button className="button-primary text-sm">Request Demo</button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <div className="section-padding flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-neutral-600 font-medium transition-colors hover:text-neutral-900"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <button className="button-secondary w-full text-sm">Login</button>
              <button className="button-primary w-full text-sm">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
