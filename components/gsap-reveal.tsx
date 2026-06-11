"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  ElementType,
  createElement,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface GsapRevealProps {
  children: ReactNode;
  /** Delay in seconds */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
  className?: string;
  as?: ElementType;
}

/** Scroll-triggered fade-up reveal powered by GSAP ScrollTrigger. */
export function GsapReveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: GsapRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, y]);

  return createElement(
    as,
    { ref, className, style: { opacity: 0 } },
    children
  );
}

interface StatCounterProps {
  /** Display value, e.g. "500+", "₹50 Cr+", "99.9%", "24/7" */
  value: string;
  className?: string;
  /** Duration in seconds */
  duration?: number;
}

/**
 * Counts a numeric stat up from 0 when scrolled into view.
 * Non-numeric values (e.g. "24/7") render as-is.
 */
export function StatCounter({
  value,
  className = "",
  duration = 1.6,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    // Unparseable or reduced motion: show final value immediately
    if (!match || prefersReducedMotion()) {
      el.textContent = value;
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (Number.isNaN(target)) {
      el.textContent = value;
      return;
    }
    const decimals = numStr.includes(".")
      ? numStr.split(".")[1].length
      : 0;

    const state = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: target,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${state.n.toFixed(decimals)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
