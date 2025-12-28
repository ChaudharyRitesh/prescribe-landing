"use client";

import ScrollReveal from "./scroll-reveal";
import { Brain, TrendingUp, Lock, Zap, Activity, Shield } from "lucide-react";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  icon?: {
    imageUpload?: any;
    imageUrl?: string;
  };
}

interface FeaturesSectionProps {
  features: any;
}

const iconMap: Record<string, any> = {
  Brain,
  TrendingUp,
  Lock,
  Zap,
  Activity,
  Shield,
};

const defaultFeatures = [
  {
    icon: Brain,
    title: "Smart Prescriptions",
    description:
      "AI validates prescriptions, checks drug interactions, and suggests optimal dosages in real-time",
    image:
      "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    description:
      "ML models predict pharmacy inventory needs based on historical patterns and seasonal trends",
    image:
      "https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    icon: Activity,
    title: "Queue Intelligence",
    description:
      "Optimize patient flow and doctor schedules with predictive appointment intelligence",
    image:
      "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    icon: Zap,
    title: "Automated Alerts",
    description:
      "Real-time notifications for critical events, low stock, and compliance violations",
    image:
      "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    icon: Lock,
    title: "Secure Access",
    description:
      "Role-based access control with end-to-end encryption and audit trails for every action",
    image:
      "https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    icon: Shield,
    title: "Compliance Ready",
    description:
      "Built for HIPAA, PMBJAY, and Indian healthcare regulations with automated reporting",
    image:
      "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
];

export function FeaturesSection({ features }: FeaturesSectionProps) {
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section className="section-padding bg-white">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Built for Real Operations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with healthcare professionals in mind.
              Reduce manual work, eliminate errors, and focus on patient care.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature: any, idx: number) => {
            const Icon = feature.icon || Brain;
            const imageUrl = feature.icon?.imageUpload
              ? urlFor(feature.icon.imageUpload).width(400).height(300).url()
              : feature.icon?.imageUrl ||
                feature.image ||
                "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";

            return (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="group h-full">
                  <div className="relative mb-6 overflow-hidden rounded-lg aspect-video bg-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={imageUrl}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
