"use client";

import { motion } from "framer-motion";
import { 
  Handshake, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Users2,
  Building2,
  PieChart
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    title: "High Commission Structure",
    description: "Earn industry-leading commissions on every successful hospital conversion and follow-on subscription.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Territory Exclusivity",
    description: "Lock in your region and manage operations with zero competition from other partners.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Advanced CRM Tools",
    description: "Access a dedicated partner dashboard to track pitches, monitor performance, and manage hospital leads.",
    icon: <PieChart className="w-6 h-6" />,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Full Training & Support",
    description: "Comprehensive product training and a dedicated support team to help you close larger hospital deals.",
    icon: <Users2 className="w-6 h-6" />,
    color: "bg-orange-50 text-orange-600"
  }
];

const features = [
  "Bespoke landing page for partners",
  "Automated commission payouts",
  "Whitelabel pitch materials",
  "Dedicated support representative",
  "Real-time analytics & reporting"
];

export function PartnerProgramSection() {
  return (
    <section id="partner-program" className="relative py-24 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="section-max-width px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-blue-600">
              <Handshake className="w-4 h-4" />
              <span>Partner with Kaero</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-[1.1]">
              Join the <span className="text-blue-600">Kaero Partner Program</span> & Scale Your Success
            </h2>

            <p className="text-lg text-neutral-600 leading-relaxed max-w-xl">
              Become a strategic partner in the healthcare revolution. We provide the tools, technology, and support you need to empower hospitals and grow your business exponentially.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-neutral-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/partner/register" 
                className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl shadow-neutral-200"
              >
                Become a Partner
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/partner/login" 
                className="px-8 py-4 bg-white text-neutral-900 border-2 border-neutral-100 rounded-2xl font-bold hover:bg-neutral-50 transition-all active:scale-[0.98]"
              >
                Partner Login
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${benefit.color} flex items-center justify-center mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sm:col-span-2 p-8 rounded-3xl bg-blue-600 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10">
                <Building2 className="w-24 h-24" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-3xl font-bold mb-1">500+</h4>
                  <p className="text-blue-100">Hospitals Empowered Globally</p>
                </div>
                <div className="h-12 w-[1px] bg-blue-400 hidden md:block" />
                <div>
                  <h4 className="text-3xl font-bold mb-1">₹50 Cr+</h4>
                  <p className="text-blue-100">Partner Commissions Paid</p>
                </div>
                <div className="h-12 w-[1px] bg-blue-400 hidden md:block" />
                <div>
                  <h4 className="text-3xl font-bold mb-1">₹0</h4>
                  <p className="text-blue-100">Joining Fee Always</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
