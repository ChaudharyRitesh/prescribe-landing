"use client";

import Image, { StaticImageData } from "next/image";
import ScrollReveal from "./scroll-reveal";
import { Zap, Users, Clock, BarChart3 } from "lucide-react";
import { urlFor } from "@/lib/sanity";

import labImage from "@/assets/lab-section.jpeg";
import pharmaImage from "@/assets/pharmacy.jpeg";
import doctorImage from "@/assets/doctor.jpeg";
import receptionImage from "@/assets/reception.jpeg";

interface Module {
  title: string;
  description: string;
  icon?: string;
  image?: {
    imageUpload?: any;
    imageUrl?: string;
  };
  features?: string[];
}

interface ModulesShowcaseProps {
  modules: Module[];
}

const iconMap: Record<string, any> = {
  Zap,
  Users,
  Clock,
  BarChart3,
};

const defaultModules = [
  {
    title: "Pharmacy Admin",
    description: "Inventory & Orders",
    icon: "Zap",
    image: pharmaImage,
    features: [
      "Inventory management",
      "Order processing",
      "Supplier integration",
      "Sales analytics",
      "Integreted billing",
      "Secure payments",
    ],
  },
  {
    title: "Doctor's Portal",
    description: "Patient Management",
    icon: "Users",
    image: doctorImage,
    features: [
      "Patient history",
      "E-prescriptions",
      "Appointment scheduling",
      "Telemedicine integration",
      "Clinical decision support",
      "Medicine Suggestions & Alerts",
    ],
  },
  {
    title: "Reception & Ops",
    description: "Queue & Appointments",
    icon: "Clock",
    image: receptionImage,
    features: [
      "Appointment scheduling",
      "Patient check-in/out",
      "Queue management",
      "Notifications & reminders",
      "Staff management",
      "Reporting & analytics",
    ],
  },
  {
    title: "Lab Dashboard",
    description: "Reports & Results",
    icon: "BarChart3",
    image: labImage,
    features: [
      "Analyzer and machine interfacing",
      "Quality control and abnormal result alerts",
      "Secure digital report delivery to patients",
    ],
  },
];

export function ModulesShowcase({ modules }: ModulesShowcaseProps) {
  const displayModules = modules.length > 0 ? modules : defaultModules;

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              4+ Modules. One Unified Core
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each Kaero Prescribe module functions as a complete standalone
              solution while remaining deeply interconnected through a unified
              data architecture. Organizations can deploy individual modules or
              operate the full ecosystem without duplication, reimplementation,
              or data fragmentation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayModules.map((module: any, idx) => {
            const Icon = iconMap[module.icon] || Zap;
            const imageSrc = module.image?.imageUpload
              ? urlFor(module.image.imageUpload).width(600).height(400).url()
              : module.image?.imageUrl ||
                module.image ||
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&h=400&q=80";

            // Check if it's a static import (has src property) or a string URL
            const isStaticImport =
              typeof imageSrc === "object" && imageSrc?.src;

            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group">
                  <div className="relative mb-6 overflow-hidden rounded-xl aspect-video bg-gray-200 shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={imageSrc}
                      alt={module.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      {...(!isStaticImport && { unoptimized: true })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {module.title}
                        </h3>
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>

                    {module.features && module.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        {module.features.map((feature: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
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
