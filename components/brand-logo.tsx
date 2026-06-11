"use client";

interface BrandLogoProps {
  /** Mark (icon) size in px; text scales proportionally */
  mark?: number;
  className?: string;
}

/**
 * Brand lockup built for dark surfaces.
 * The bundled logo.png has a dark navy "Prescribe" script that vanishes on
 * navy backgrounds, so we crop the teal cross mark from the image and render
 * the wordmark as text in theme colors.
 */
export function BrandLogo({ mark = 44, className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* Cropped mark: logo.png is a wide lockup; the cross occupies the left square */}
      <span
        className="relative shrink-0 overflow-hidden"
        style={{ width: mark, height: mark }}
        aria-hidden="true"
      >
        <img
          src="/logo.png"
          alt=""
          className="w-auto max-w-none"
          style={{ height: mark }}
        />
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span
          className="font-heading bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text font-extrabold tracking-[0.22em] text-transparent"
          style={{ fontSize: Math.round(mark * 0.42) }}
        >
          KAERO
        </span>
        <span
          className="mt-1 font-medium italic tracking-wide text-slate-300"
          style={{ fontSize: Math.round(mark * 0.3) }}
        >
          Prescribe
        </span>
      </span>
    </span>
  );
}
