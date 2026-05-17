"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface StaggeredShowcaseProps {
  slides: {
    title: string;
    description?: string;
    image: string;
  }[];
}

export function StaggeredShowcase({ slides }: StaggeredShowcaseProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const displaySlides = slides.length > 0 ? slides : [
    {
      title: "Sarah Johnson Dashboard",
      image: "/dashboard-laptop.png",
    },
    {
      title: "Clinical Analytics",
      image: "/dashboard-monitor.png",
    }
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4 md:px-0">
      <div className="relative flex flex-col items-end pt-12">
        {/* Monitor Frame (Back Layer) */}
        <div className="relative z-10 w-full lg:w-[90%] translate-x-4 lg:translate-x-16 opacity-100 flex flex-col items-center transition-all duration-700">
          <div className="relative bg-white rounded-2xl p-2.5 shadow-[0_30px_70px_rgba(0,0,0,0.15)] border-[1px] border-gray-200 w-full">
            {/* Screen */}
            <div className="relative bg-white rounded-xl overflow-hidden aspect-[16/10] border border-gray-100">
              <img
                src="/dashboard-monitor.png"
                alt="Monitor Display"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Minimalist Monitor Stand - Silver/Chrome Look */}
          <div className="flex flex-col items-center">
            <div className="w-2 md:w-4 h-12 md:h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 border-x border-gray-400/10 shadow-sm"></div>
            <div className="w-32 md:w-56 h-2 md:h-3 bg-gradient-to-b from-gray-300 to-gray-200 rounded-t-xl rounded-b-sm shadow-md border-t border-white/50"></div>
          </div>
        </div>

        {/* Laptop Frame (Front Layer) - Now Absolute to allow overlap/proximity to tags */}
        <div className="absolute z-30 w-[85%] lg:w-[75%] -left-8 md:-left-16 lg:-left-48 top-1/2 lg:top-[40%] transform transition-all duration-700 drop-shadow-[0_45px_100px_rgba(0,0,0,0.25)]">
          <div className="relative">
            {/* MacBook Top */}
            <div className="relative bg-[#1A1A1A] rounded-t-2xl pt-1.5 px-1.5 border-t border-x border-white/5">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-2.5 md:h-4 bg-black rounded-b-2xl z-40"></div>
              
              {/* Laptop Screen */}
              <div className="relative bg-white rounded-t-lg overflow-hidden aspect-video border-[1px] border-gray-100 shadow-inner">
                <img
                  src="/dashboard-laptop.png"
                  alt="Laptop Display"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* MacBook Bottom */}
            <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] h-3 md:h-5 rounded-b-3xl px-1 relative border-x border-b border-black/20 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-28 h-1 md:h-1.5 bg-black rounded-b-full shadow-inner opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Overlay - simplified to match the cleaner look */}
      <div className="mt-16 text-center max-w-xl mx-auto px-4 opacity-70">
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === 1 ? "w-8 bg-blue-400" : "w-3 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
