'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MacbookCarouselProps {
  slides: {
    title: string;
    description: string;
    image: string;
  }[];
  autoPlay?: boolean;
}

export function MacbookCarousel({ slides, autoPlay = true }: MacbookCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, autoPlay]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full">
      {/* MacBook Frame */}
      <div className="relative mx-auto max-w-4xl">
        {/* Outer bezel */}
        <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-3 shadow-2xl">
          {/* Screen */}
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-20"></div>

            {/* Slides */}
            <div className="relative w-full h-full overflow-hidden">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === current ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bezel with logo */}
          <div className="h-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-3xl flex items-center justify-center">
            <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Slide Info */}
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">{slides[current].title}</h3>
          <p className="text-neutral-600 max-w-2xl mx-auto">{slides[current].description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <ChevronLeft size={20} className="text-neutral-900" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? 'w-8 bg-blue-600' : 'w-2 bg-neutral-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <ChevronRight size={20} className="text-neutral-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
