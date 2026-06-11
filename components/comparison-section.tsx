"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X, Sparkles, Building2 } from "lucide-react";
import { GsapReveal } from "./gsap-reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Comparison {
  feature: string;
  kaero: boolean;
  traditional: boolean;
}

interface ComparisonSectionProps {
  comparisons: Comparison[];
}

const defaultComparisons = [
  { feature: "Modular Architecture", kaero: true, traditional: false },
  { feature: "AI-Native Intelligence", kaero: true, traditional: false },
  { feature: "Real-time Sync", kaero: true, traditional: false },
  { feature: "Automated Compliance", kaero: true, traditional: false },
  { feature: "Scalable Pricing", kaero: true, traditional: false },
  { feature: "Cloud-Native", kaero: true, traditional: false },
  { feature: "Audit Trails", kaero: true, traditional: true },
];

export function ComparisonSection({ comparisons }: ComparisonSectionProps) {
  const displayComparisons =
    comparisons.length > 0 ? comparisons : defaultComparisons;

  const boardRef = useRef<HTMLDivElement>(null);

  const kaeroScore = displayComparisons.filter((c) => c.kaero).length;
  const traditionalScore = displayComparisons.filter(
    (c) => c.traditional
  ).length;
  const total = displayComparisons.length;

  // Rows cascade in; KaeroPrescribe checkmarks pop with an elastic snap
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const rows = board.querySelectorAll("[data-row]");
    const marks = board.querySelectorAll("[data-mark]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([rows, marks], { opacity: 1, x: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(rows, { opacity: 0, x: -20 });
      gsap.set(marks, { scale: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: board,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(rows, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power3.out",
      }).to(
        marks,
        {
          scale: 1,
          duration: 0.45,
          stagger: 0.09,
          ease: "back.out(2.5)",
        },
        0.25
      );
    }, board);

    return () => ctx.revert();
  }, [displayComparisons.length]);

  return (
    <section className="lp-section relative overflow-hidden bg-ink-deep">
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-sky-600/10 blur-[130px]" />

      <div className="lp-container relative">
        <GsapReveal className="mx-auto max-w-2xl text-center">
          <span className="lp-eyebrow">Comparison</span>
          <h2 className="lp-h2 mt-5">Why KaeroPrescribe Wins</h2>
          <p className="lp-sub mt-4">
            Built from the ground up for modern healthcare — not a legacy
            system with AI bolted on.
          </p>
        </GsapReveal>

        <GsapReveal delay={0.1} className="mx-auto mt-12 max-w-4xl lg:mt-16">
          <div
            ref={boardRef}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_40px_80px_-32px_rgba(2,6,23,0.9)] backdrop-blur"
          >
            {/* Contender header */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-white/10">
              <div className="hidden items-end px-6 pb-4 pt-6 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:flex md:px-8">
                Capability
              </div>
              <div className="col-span-2 grid grid-cols-2 sm:col-span-2">
                {/* Kaero card */}
                <div className="relative overflow-hidden px-3 py-5 text-center md:py-6">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-500/20 via-sky-600/10 to-transparent" />
                  <div className="relative">
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_8px_20px_-6px_rgba(45,212,191,0.6)]">
                      <Sparkles size={16} />
                    </span>
                    <p className="font-heading mt-2 text-sm font-bold text-white md:text-base">
                      KaeroPrescribe
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-teal-300">
                      AI-native platform
                    </p>
                  </div>
                </div>
                {/* Traditional card */}
                <div className="px-3 py-5 text-center md:py-6">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-slate-500">
                    <Building2 size={16} />
                  </span>
                  <p className="font-heading mt-2 text-sm font-semibold text-slate-400 md:text-base">
                    Traditional HMS
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    Legacy systems
                  </p>
                </div>
              </div>
            </div>

            {/* Capability rows */}
            {displayComparisons.map((row, idx) => (
              <div
                key={idx}
                data-row
                className={`grid grid-cols-[1.3fr_1fr_1fr] transition-colors duration-200 hover:bg-white/[0.04] ${
                  idx < displayComparisons.length - 1
                    ? "border-b border-white/[0.06]"
                    : ""
                }`}
              >
                <div className="flex items-center px-4 py-4 text-[13px] font-medium text-slate-200 sm:px-6 md:px-8 md:text-sm">
                  {row.feature}
                </div>
                <div className="relative flex items-center justify-center py-4">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.06] to-transparent" />
                  {row.kaero ? (
                    <span
                      data-mark
                      className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_0_16px_rgba(45,212,191,0.45)]"
                    >
                      <Check size={15} strokeWidth={3.5} />
                    </span>
                  ) : (
                    <span
                      data-mark
                      className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-slate-500"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center py-4">
                  {row.traditional ? (
                    <span
                      data-mark
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-300"
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      data-mark
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-slate-600"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Scoreline */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-white/10 bg-white/[0.03]">
              <div className="flex items-center px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 sm:px-6 md:px-8">
                Score
              </div>
              <div className="flex items-center justify-center py-4">
                <span className="font-heading rounded-full bg-gradient-to-r from-teal-400 to-sky-500 px-4 py-1 text-sm font-extrabold text-slate-950 shadow-[0_8px_20px_-6px_rgba(45,212,191,0.5)]">
                  {kaeroScore}/{total}
                </span>
              </div>
              <div className="flex items-center justify-center py-4">
                <span className="font-heading rounded-full bg-white/[0.06] px-4 py-1 text-sm font-bold text-slate-400">
                  {traditionalScore}/{total}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Comparison reflects typical legacy hospital management systems
            deployed in Indian facilities.
          </p>
        </GsapReveal>
      </div>
    </section>
  );
}
