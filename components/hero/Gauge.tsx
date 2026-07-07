import React from "react";

interface GaugeProps {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: number | string;
  max?: number | string;
}

const TICK_COUNT = 40;
const CENTER = { x: 100, y: 100 };
const OUTER_R = 80;
const INNER_R = OUTER_R - 10;

export default function Gauge({
  value,
  color = "#ef4d23",
  showLabels = false,
  min,
  max,
}: GaugeProps) {
  const activeCount = Math.round((value / 100) * TICK_COUNT);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    // Sweep the 180° top arc from angle π (left) to 2π (right).
    const angle = Math.PI + (i / (TICK_COUNT - 1)) * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x1 = CENTER.x + INNER_R * cos;
    const y1 = CENTER.y + INNER_R * sin;
    const x2 = CENTER.x + OUTER_R * cos;
    const y2 = CENTER.y + OUTER_R * sin;
    const isActive = i < activeCount;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isActive ? color : "#d4d4d8"}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="w-full" style={{ maxWidth: 260, margin: "0 auto" }}>
      <svg viewBox="0 0 200 120" className="w-full">
        {ticks}
        <text
          x={100}
          y={105}
          textAnchor="middle"
          fontSize={22}
          fontWeight={600}
          fill="#111827"
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="flex justify-between text-[11px] text-neutral-500 px-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
