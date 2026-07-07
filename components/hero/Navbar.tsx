"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, ShoppingCart, Menu } from "lucide-react";

const ORANGE = "#ef4d23";

function Logo() {
  // 8-petal flower: 8 circles at radius 10 around center (16,16) + center circle.
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI;
    const cx = 16 + 10 * Math.cos(angle);
    const cy = 16 + 10 * Math.sin(angle);
    return <circle key={i} cx={cx} cy={cy} r={3.5} />;
  });
  return (
    <svg
      viewBox="0 0 32 32"
      className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
      fill={ORANGE}
    >
      {petals}
      <circle cx={16} cy={16} r={3.5} />
    </svg>
  );
}

const NAV_ITEMS = ["Home", "Features", "About", "Pages"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
      <nav className="bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[760px] relative flex items-center">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 ml-6 text-[14px]">
          <a href="#" className="inline-flex items-center gap-1.5 text-neutral-900">
            <span className="w-[1.5px] h-[1.5px] rounded-full bg-black inline-block" />
            Home
          </a>
          <a href="#" className="text-neutral-900">
            Features
          </a>
          <a href="#" className="text-neutral-900">
            About
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1"
            style={{ color: ORANGE }}
          >
            Pages
            <ChevronDown size={3.5} className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <ShoppingCart className="hidden sm:block w-5 h-5 text-neutral-700" />

          <button
            className="inline-flex items-center gap-2 text-white rounded-full pl-4 pr-1.5 py-1.5 text-[14px]"
            style={{ backgroundColor: ORANGE }}
          >
            <span className="hidden sm:inline">Get early access</span>
            <span className="sm:hidden">Early access</span>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-neutral-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-3 z-20 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-2 rounded-lg text-[14px] text-neutral-900 hover:bg-neutral-50"
                style={item === "Pages" ? { color: ORANGE } : undefined}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
