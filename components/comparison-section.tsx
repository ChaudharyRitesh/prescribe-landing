"use client";

import ScrollReveal from "./scroll-reveal";
import { Check, X } from "lucide-react";

interface Comparison {
  feature: string;
  kaero: boolean;
  traditional: boolean;
}

interface ComparisonSectionProps {
  comparisons: Comparison[];
}

const defaultComparisons = [
  { feature: "Modular Architecture", kaero: true, traditional: false },
  { feature: "AI-Native Intelligence", kaero: true, traditional: false },
  { feature: "Real-time Sync", kaero: true, traditional: false },
  { feature: "Automated Compliance", kaero: true, traditional: false },
  { feature: "Scalable Pricing", kaero: true, traditional: false },
  { feature: "Indian Regulations", kaero: true, traditional: false },
  { feature: "Cloud-Native", kaero: true, traditional: false },
  { feature: "Audit Trails", kaero: true, traditional: true },
];

export function ComparisonSection({ comparisons }: ComparisonSectionProps) {
  const displayComparisons =
    comparisons.length > 0 ? comparisons : defaultComparisons;

  return (
    <section className="section-padding bg-gray-50">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Kaero Prescribe Wins
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built from the ground up for modern healthcare. Not a legacy
              system with AI bolted on.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-8 p-8 border-b border-gray-200 bg-gray-50">
              <div className="text-sm font-semibold text-gray-900">Feature</div>
              <div className="text-sm font-semibold text-blue-600 text-center">
                KaeroCare
              </div>
              <div className="text-sm font-semibold text-gray-600 text-center">
                Traditional
              </div>
            </div>

            <div>
              {displayComparisons.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-8 p-8 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {row.feature}
                  </div>
                  <div className="flex justify-center">
                    {row.kaero ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <X size={18} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.traditional ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <X size={18} className="text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
