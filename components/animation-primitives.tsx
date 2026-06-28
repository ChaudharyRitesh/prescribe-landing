"use client";

import {
  ReactNode,
  ElementType,
  useEffect,
  useRef,
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

function isTouch() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   GsapTextReveal — word-by-word mask reveal
   Each word rises out of an overflow-hidden clip with a staggered cascade.
   Accepts plain text or styled segments (e.g. a gradient sub-phrase).
   ────────────────────────────────────────────────────────────────────────── */

interface TextSegment {
  text: string;
  /** className applied to this segment's words (e.g. gradient classes) */
  className?: string;
}

interface GsapTextRevealProps {
  /** Plain string, or styled segments for multi-color headlines */
  segments: string | TextSegment[];
  className?: string;
  as?: ElementType;
  /** Animate immediately on mount (hero) vs. on scroll into view */
  immediate?: boolean;
  /** Stagger between words (s) */
  stagger?: number;
  /** Initial delay (s) */
  delay?: number;
}

export function GsapTextReveal({
  segments,
  className = "",
  as = "h2",
  immediate = false,
  stagger = 0.06,
  delay = 0,
}: GsapTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  const segs: TextSegment[] =
    typeof segments === "string" ? [{ text: segments }] : segments;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 120, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power4.out",
        stagger,
        delay,
        ...(immediate
          ? {}
          : {
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
      });
    }, el);

    return () => ctx.revert();
  }, [immediate, stagger, delay]);

  const fullText = segs.map((s) => s.text).join(" ");

  let key = 0;
  return createElement(
    as,
    { ref, className, "aria-label": fullText },
    segs.map((seg, si) => {
      const wordsArr = seg.text.split(" ").filter(Boolean);
      return wordsArr.map((w, wi) => (
        <span
          key={`${si}-${wi}-${key++}`}
          className="inline-flex overflow-hidden align-bottom"
          // room for descenders (g, p, y) inside the clip without shifting layout
          style={{ paddingBottom: "0.15em", marginBottom: "-0.15em" }}
          aria-hidden="true"
        >
          <span
            data-word
            className={`inline-block ${seg.className ?? ""}`}
            style={{ opacity: 0 }}
          >
            {w}
          </span>
          {/* keep a real space between words */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ));
    })
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   GsapParallax — scroll-scrubbed vertical drift
   ────────────────────────────────────────────────────────────────────────── */

interface GsapParallaxProps {
  children: ReactNode;
  /** px of travel across the element's viewport transit (negative = up) */
  speed?: number;
  className?: string;
  as?: ElementType;
}

export function GsapParallax({
  children,
  speed = -60,
  className = "",
  as = "div",
}: GsapParallaxProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -speed / 2 },
        {
          y: speed / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return createElement(as, { ref, className }, children);
}

/* ──────────────────────────────────────────────────────────────────────────
   MagneticButton — wrapper that pulls toward the cursor
   ────────────────────────────────────────────────────────────────────────── */

interface MagneticButtonProps {
  children: ReactNode;
  /** 0–1, how strongly the element follows the cursor */
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.4,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isTouch()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-flex will-change-transform ${className}`}>
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TiltCard — 3D rotation toward the cursor on hover
   ────────────────────────────────────────────────────────────────────────── */

interface TiltCardProps {
  children: ReactNode;
  /** max tilt in degrees */
  max?: number;
  className?: string;
}

export function TiltCard({ children, max = 8, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isTouch()) return;

    const rotX = gsap.quickTo(el, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotY = gsap.quickTo(el, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
