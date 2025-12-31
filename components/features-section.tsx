"use client";

import { useState } from "react";
import ScrollReveal from "./scroll-reveal";
import { Play } from "lucide-react";
import Image from "next/image";

interface FeaturesSectionProps {
  features?: any;
  youtubeVideoId?: string;
}

// Default YouTube video ID - replace with your actual video ID
const DEFAULT_YOUTUBE_VIDEO_ID = "bu27ErSgjSs";

export function FeaturesSection({
  features,
  youtubeVideoId = DEFAULT_YOUTUBE_VIDEO_ID,
}: FeaturesSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-28 bg-white">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Built for Real Operations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kaero Prescribe was created in collaboration with clinicians,
              administrators, and healthcare operators who needed systems that
              reflect real-world workflows. Every module is designed to reduce
              friction, improve visibility, and scale seamlessly as
              organizations grow.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="relative max-w-4xl mx-auto">
            {/* Video container with aspect ratio */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              {!isPlaying ? (
                <>
                  {/* YouTube Thumbnail */}
                  <Image
                    src={thumbnailUrl}
                    alt="Video preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
                    priority
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 transition-opacity hover:bg-black/20" />

                  {/* Play button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                    aria-label="Play video"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-700">
                      <Play
                        className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                        fill="white"
                      />
                    </div>
                  </button>

                  {/* Optional: "Watch Demo" text */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-md">
                      Watch Demo
                    </span>
                  </div>
                </>
              ) : (
                /* YouTube iframe embed */
                <iframe
                  src={embedUrl}
                  title="Product Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
