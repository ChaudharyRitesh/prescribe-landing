"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MacbookShowcaseProps {
  slides: {
    title: string;
    description?: string;
    image: string;
  }[];
}

export function MacbookShowcase({ slides }: MacbookShowcaseProps) {
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

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-none">
        {/* MacBook Frame */}
        <div className="relative">
          {/* Top bezel */}
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl sm:rounded-t-3xl pt-2 sm:pt-3 px-2 sm:px-3">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 md:w-32 h-3 sm:h-4 md:h-5 bg-black rounded-b-xl sm:rounded-b-2xl z-20"></div>

            {/* Screen */}
            <div className="relative bg-black rounded-t-xl sm:rounded-t-2xl overflow-hidden aspect-video">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === current ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bezel */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-b-2xl sm:rounded-b-3xl px-2 sm:px-3 pb-2 sm:pb-3 flex justify-center">
            <div className="h-1.5 sm:h-2 w-20 sm:w-32 bg-gray-800 rounded-full"></div>
          </div>

          {/* Shadow */}
          <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 w-full h-4 sm:h-6 md:h-8 bg-black/10 blur-xl rounded-full"></div>
        </div>

        {/* Info */}
        <div className="mt-6 sm:mt-8 md:mt-12 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
            {slides[current].title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {slides[current].description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 md:mt-8">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-900" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
