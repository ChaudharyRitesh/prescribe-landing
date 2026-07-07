import React from "react";
import "./fonts.css";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/hero/Navbar";
import DashboardPreview from "@/components/hero/DashboardPreview";

const ORANGE = "#ef4d23";
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4";
const POSTER =
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60";

export default function HeroPage() {
  return (
    <div
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          poster={POSTER}
          webkit-playsinline="true"
          x5-playsinline="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Foreground */}
        <div className="relative z-10">
          <Navbar />

          {/* Hero content */}
          <div className="flex flex-col items-center px-4 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              Convix Software
            </div>

            <h1
              className="mt-5 sm:mt-6 max-w-4xl"
              style={{
                fontSize: "clamp(36px, 8vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Shaping{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Agencies
              </span>
              <br />
              of tomorrow
            </h1>

            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2"
              style={{ fontSize: "clamp(13px, 3.5vw, 16px)" }}
            >
              The All-In-One Software Powering the Future of PR Agencies
            </p>

            <button className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[14px]">
              Get Started
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* Dashboard preview */}
          <div className="px-3 sm:px-4">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
