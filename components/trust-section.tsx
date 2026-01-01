"use client";

import ScrollReveal from "./scroll-reveal";
import {
  Shield,
  Lock,
  FileCheck,
  Server,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface TrustItem {
  title: string;
  description: string;
}

interface TrustSectionProps {
  items: TrustItem[];
}

const defaultItems = [
  {
    title: "Regulated Architecture",
    description:
      "Built from the ground up for healthcare compliance. HIPAA-ready foundations. Support for Indian healthcare regulations.",
    icon: Shield,
    color: "blue",
  },
  {
    title: "Complete Audit Trails",
    description:
      "Every transaction, every access, every change is logged and traceable. Complete compliance documentation.",
    icon: FileCheck,
    color: "green",
  },
  {
    title: "Enterprise Security",
    description:
      "AES-256 encryption at rest, TLS 1.3 in transit. Regular security audits and penetration testing. Zero-trust architecture.",
    icon: Lock,
    color: "purple",
  },
  {
    title: "Disaster Recovery",
    description:
      "Multi-region redundancy. Automated backups. RTO < 1 hour. RPO < 15 minutes. 99.9% uptime guarantee.",
    icon: Server,
    color: "orange",
  },
];

const certifications = [
  { name: "HIPAA", status: "Compliant" },
  { name: "DPDP Act", status: "Compliant" },
  { name: "ISO 27001", status: "Aligned" },
  { name: "GDPR", status: "Ready" },
];

const colorClasses: Record<
  string,
  { bg: string; icon: string; border: string }
> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    border: "border-green-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-100",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    border: "border-orange-100",
  },
};

export function TrustSection({ items }: TrustSectionProps) {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <CheckCircle2 size={16} />
              Enterprise-Grade Security
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Trust Built In
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Healthcare data demands the highest standards. We don't compromise
              on security or compliance.
            </p>
          </div>
        </ScrollReveal>

        {/* Certification Badges */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {cert.name}
                  </p>
                  <p className="text-xs text-green-600">{cert.status}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {defaultItems.map((item, i) => {
            const Icon = item.icon;
            const colors = colorClasses[item.color];

            return (
              <ScrollReveal key={i} delay={i * 100}>
                <div
                  className={`p-8 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-5`}
                  >
                    <Icon size={24} className={colors.icon} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Stats Bar */}
        <ScrollReveal>
          <div className="bg-gray-900 rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "99.9%", label: "Uptime SLA" },
                { value: "256-bit", label: "Encryption" },
                { value: "<1hr", label: "Recovery Time" },
                { value: "24/7", label: "Security Monitoring" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA to Compliance Page */}
        <ScrollReveal>
          <div className="text-center mt-12">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              View Full Compliance Documentation
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
