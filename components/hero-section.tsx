"use client";

import { StaggeredShowcase } from "./staggered-showcase";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import Link from "next/link";
import type { HeroSection as HeroSectionType } from "@/lib/sanity.types";

interface HeroSectionProps {
  data: HeroSectionType | null;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function HeroSection({ data }: HeroSectionProps) {
  const fallbackSlides = [
    {
      title: "Pharmacy Dashboard",
      image: "/dashboard-monitor.png",
    }
  ];

  const title = data?.title || "Streamline Your Prescribing";
  const subtitle = data?.subtitle || "with Kaero Prescribe";
  const description =
    "Efficient E-Prescribing & Patient Management Made Easy.";

  const resolvedSlides =
    data?.slides && data.slides.length > 0
      ? data.slides.map((slide, idx) => {
        const slideImageUrl = slide?.image
          ? urlFor(slide.image).width(1200).height(800).url()
          : "/dashboard-monitor.png";

        return {
          title: slide?.title || "Dashboard",
          image: slideImageUrl,
        };
      })
      : fallbackSlides;

  return (
    <section className="relative min-h-screen pt-32 lg:pt-24 bg-white bg-[url('/hero-bg.png')] bg-cover bg-center overflow-hidden">
      {/* Wave background is now handled by the image in public/hero-bg.png */}

      <div className="section-max-width section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-10 lg:pt-10">
            <div className="max-w-3xl">
              <h1 className="text-6xl leading-[30px] md:text-7xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-8">
                Streamline Your Prescribing <span className="bg-gradient-to-r leading-[30px] from-blue-950   via-blue-400 to-blue-300 bg-clip-text text-transparent">with Kaero Prescribe</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12 leading-relaxed max-w-xl">
                {description}
              </p>

              <div className="space-y-5 mb-14">
                {[
                  "Fast e-prescriptions",
                  "Comprehensive patient profiles",
                  "Automated refill management",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex">
                <Link
                  href="#contact"
                  className="px-12 py-5 rounded-fill bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-[0_15px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.35)] hover:-translate-y-1 flex items-center gap-3 rounded-full"
                >
                  Get Started
                  <ArrowRight size={22} />
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-full">
            <StaggeredShowcase slides={resolvedSlides} />
          </div>
        </div>

        <div className="lg:hidden mt-20">
          <StaggeredShowcase slides={resolvedSlides} />
        </div>
      </div>
    </section>
  );
}
