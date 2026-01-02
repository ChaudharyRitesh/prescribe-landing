"use client";

import ScrollReveal from "./scroll-reveal";
import { MacbookShowcase } from "./macbook-showcase";

interface CTAData {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  footerText?: string;
}

interface CTASectionProps {
  data: CTAData | null;
}

export function CTASection({ data }: CTASectionProps) {
  const slides = [
    {
      title: "Hospital Management Dashboard",
      description:
        "Centralized control over patient care, bed management, and clinical workflows",
      image:
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&h=675&q=80",
    },
    {
      title: "Pharmacy & Inventory Control",
      description:
        "Smart inventory management with real-time stock tracking and expiry alerts",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&h=675&q=80",
    },
    {
      title: "Laboratory Information System",
      description:
        "Streamlined sample processing with automated result validation",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&h=675&q=80",
    },
  ];

  const title = data?.title || "Ready to Transform Your Healthcare Operations?";
  const description =
    data?.description ||
    "Join forward-thinking healthcare organizations already using KaeroPrescribe to reduce costs, improve patient care, and scale with confidence.";
  const footer =
    data?.footerText ||
    "This section is a quick snapshot of what KaeroPrescribe is built to deliver across your core hospital workflows.";

  return (
    <section className="section-padding bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="section-max-width">
        <ScrollReveal>
          <div className="mb-16">
            <div className="hidden md:block mb-16">
              <MacbookShowcase slides={slides} />
            </div>

            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                {title}
              </h2>

              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {description}
              </p>

              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-gray-400">{footer}</p>
                <p className="text-sm text-gray-400 mt-3">
                  Designed for operational clarity: unified dashboards,
                  compliant records, and reliable workflows across OPD, IPD,
                  Lab, and Pharmacy.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
