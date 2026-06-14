"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Play,
  ClipboardCheck,
  Users,
  BarChart3,
  Timer,
  FileCheck2,
} from "lucide-react";
import { GsapReveal } from "./gsap-reveal";
import { GsapTextReveal, TiltCard } from "./animation-primitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturesSectionProps {
  features?: any;
  youtubeVideoId?: string;
}

const DEFAULT_YOUTUBE_VIDEO_ID = "bu27ErSgjSs";

const workflowSteps = [
  {
    icon: ClipboardCheck,
    title: "Clinician-Designed Workflows",
    text: "Screens follow how doctors, pharmacists, and lab techs actually work — not how software vendors think they do.",
  },
  {
    icon: Users,
    title: "Built with Operators",
    text: "Created in collaboration with administrators and healthcare operators running real facilities every day.",
  },
  {
    icon: BarChart3,
    title: "Operational Visibility",
    text: "Queues, revenue, inventory, and compliance status surface in one command view across every module.",
  },
];

export function FeaturesSection({
  features,
  youtubeVideoId = DEFAULT_YOUTUBE_VIDEO_ID,
}: FeaturesSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReduced = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;

  // Vertical progress line draws itself as the steps scroll through view
  useEffect(() => {
    const line = lineRef.current;
    const steps = stepsRef.current;
    if (!line || !steps) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: steps,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const floatAnim = prefersReduced
    ? {}
    : {
        animate: { y: [0, -10, 0] },
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <section
      id="features"
      className="lp-section relative overflow-hidden bg-ink-deep"
    >
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-sky-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="lp-container relative">
        <GsapReveal className="mx-auto max-w-2xl text-center">
          <span className="lp-eyebrow">Product Demo</span>
          <GsapTextReveal
            as="h2"
            className="lp-h2 mt-5"
            segments="Built for Real Operations"
          />
          <p className="lp-sub mt-4">
            Watch how KaeroPrescribe mirrors real clinical workflows — from
            first patient check-in to dispensed prescription.
          </p>
        </GsapReveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-14 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Workflow timeline */}
          <div ref={stepsRef} className="relative order-2 lg:order-1">
            {/* Track + animated progress line */}
            <div className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-white/10" />
            <div
              ref={lineRef}
              className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-gradient-to-b from-teal-400 via-sky-400 to-sky-600"
              style={{ transform: "scaleY(0)" }}
            />

            <div className="space-y-10">
              {workflowSteps.map(({ icon: Icon, title, text }, i) => (
                <GsapReveal key={title} delay={0.1 * i}>
                  <div className="relative flex gap-6 pl-0">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-teal-400/30 bg-ink shadow-[0_0_24px_-4px_rgba(45,212,191,0.45)]">
                      <Icon size={20} className="text-teal-300" />
                    </span>
                    <div className="pt-1">
                      <h3 className="font-heading text-lg font-semibold text-white">
                        {title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                        {text}
                      </p>
                    </div>
                  </div>
                </GsapReveal>
              ))}
            </div>
          </div>

          {/* Video centerpiece */}
          <GsapReveal delay={0.15} className="order-1 lg:order-2">
            <div className="relative">
              {/* Ambient glow ring */}
              <div className="pointer-events-none absolute -inset-5 rounded-[1.8rem] bg-gradient-to-tr from-teal-500/30 via-sky-500/10 to-sky-600/30 opacity-70 blur-xl" />

              <TiltCard max={5} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_40px_90px_-30px_rgba(2,6,23,0.95)] backdrop-blur">
                {/* Browser chrome bar to echo the hero frame */}
                <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 hidden flex-1 items-center justify-center sm:flex">
                    <span className="rounded-md bg-white/5 px-4 py-1 text-[11px] font-medium tracking-wide text-slate-400">
                      Platform walkthrough — 2 min
                    </span>
                  </span>
                </div>

                <div className="relative aspect-video w-full">
                  {!isPlaying ? (
                    <button
                      onClick={() => setIsPlaying(true)}
                      aria-label="Play product demo video"
                      className="group absolute inset-0 block h-full w-full cursor-pointer"
                    >
                      <img
                        src={thumbnailUrl}
                        alt="KaeroPrescribe product demo preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-slate-950/45 transition-colors duration-300 group-hover:bg-slate-950/25" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
                          {!prefersReduced && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400/30" />
                          )}
                          <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_12px_36px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110">
                            <Play
                              size={28}
                              className="ml-1"
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      </span>
                    </button>
                  ) : (
                    <iframe
                      src={embedUrl}
                      title="Product Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  )}
                </div>
              </TiltCard>

              {/* Floating metric chips */}
              <motion.div
                {...floatAnim}
                className="absolute -left-4 -top-5 hidden rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:flex md:items-center md:gap-2.5 lg:-left-8"
              >
                <Timer size={16} className="text-teal-300" />
                <span className="text-xs font-semibold text-white">
                  Check-in to Rx in minutes
                </span>
              </motion.div>

              <motion.div
                {...(prefersReduced
                  ? {}
                  : {
                      animate: { y: [0, 10, 0] },
                      transition: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                        delay: 0.8,
                      },
                    })}
                className="absolute -bottom-5 -right-3 hidden rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:flex md:items-center md:gap-2.5 lg:-right-7"
              >
                <FileCheck2 size={16} className="text-sky-300" />
                <span className="text-xs font-semibold text-white">
                  Every step audit-trailed
                </span>
              </motion.div>
            </div>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
