"use client";

import { useState } from "react";
import ScrollReveal from "./scroll-reveal";
import {
  Check,
  ArrowRight,
  Users,
  Stethoscope,
  Beaker,
  Pill,
} from "lucide-react";
import type { PricingPlan } from "@/lib/sanity.types";
import { EnterpriseInquiryDialog } from "@/components/enterprise-inquiry-dialog";

interface PricingSectionProps {
  plans: PricingPlan[];
  modules: PricingPlan[];
}

type BillingPeriod = "yearly" | "half-yearly";
type ModulePlanTier = "base" | "super";

const iconMap: Record<string, any> = {
  Users,
  Stethoscope,
  Beaker,
  Pill,
};

// Default module pricing data - Base Plan vs Super Plan (per month)
const defaultModulePricing = {
  "OPD Management": {
    base: {
      price: "₹1,499",
      savings: "",
      description: "Essential features",
      features: [
        "Patient Registration",
        "Appointment Scheduling",
        "Basic Prescription",
        "Billing & Invoicing",
      ],
    },
    super: {
      price: "₹2,499",
      savings: "Best Value",
      description: "All features + priority support",
      features: [
        "Everything in Base Plan",
        "Queue Management",
        "Advanced Prescription Templates",
        "Patient History & Analytics",
        "SMS & Email Notifications",
        "Priority Support",
      ],
    },
  },
  "IPD Management": {
    base: {
      price: "₹1,999",
      savings: "",
      description: "Essential features",
      features: [
        "Bed Management",
        "Admission & Discharge",
        "Basic Treatment Plans",
        "Ward Assignment",
      ],
    },
    super: {
      price: "₹2,999",
      savings: "Best Value",
      description: "All features + priority support",
      features: [
        "Everything in Base Plan",
        "Nursing Station Dashboard",
        "Diet Management",
        "Surgery Scheduling",
        "Real-time Bed Tracking",
        "Priority Support",
      ],
    },
  },
  "Lab Management": {
    base: {
      price: "₹1,249",
      savings: "",
      description: "Essential features",
      features: [
        "Test Catalog",
        "Sample Collection",
        "Basic Report Generation",
        "Result Entry",
      ],
    },
    super: {
      price: "₹1,999",
      savings: "Best Value",
      description: "All features + priority support",
      features: [
        "Everything in Base Plan",
        "Equipment Integration",
        "Auto Result Validation",
        "Digital Report Delivery",
        "Quality Control Alerts",
        "Priority Support",
      ],
    },
  },
  "Pharmacy Management": {
    base: {
      price: "₹999",
      savings: "",
      description: "Essential features",
      features: [
        "Inventory Management",
        "Sales & Billing",
        "Stock Tracking",
        "Basic Reports",
      ],
    },
    super: {
      price: "₹1,499",
      savings: "Best Value",
      description: "All features + priority support",
      features: [
        "Everything in Base Plan",
        "Auto Reorder Alerts",
        "Batch & Expiry Tracking",
        "Supplier Management",
        "Advanced Analytics",
        "Priority Support",
      ],
    },
  },
};

// Default all-in-one package pricing
const defaultPackagePricing = {
  "Base Plan": {
    yearly: { price: "₹43,326", originalPrice: "₹52,200", savings: "Save 17%" },
    "half-yearly": { price: "₹26,100", originalPrice: "", savings: "" },
    description: "Perfect for small clinics getting started",
    features: [
      "Upto 200 patients accounts",
      "Upto 5 licensed doctors accounts",
      "Upto 2 receptionist accounts",
      "Upto 2 pharmacy accounts",
      "Upto 2 lab technician accounts",
      "10 GB Storage",
    ],
  },
  "Super Plan": {
    yearly: { price: "₹66,400", originalPrice: "₹79,999", savings: "Save 17%" },
    "half-yearly": { price: "₹39,999", originalPrice: "", savings: "" },
    description: "Ideal for growing healthcare facilities",
    features: [
      "White labeling options",
      "Priority support",
      "All Base Plan features",
      "Upto 500 patients accounts",
      "Upto 15 licensed doctors accounts",
      "Upto 5 receptionist accounts",
      "Upto 5 pharmacy accounts",
      "Upto 5 lab technician accounts",
      "Custom data integration support",
      "25 GB Storage",
    ],
    isPopular: true,
  },
  "Enterprise Plan": {
    yearly: {
      price: "₹1,77,509",
      originalPrice: "₹1,93,998",
      savings: "Save 17%",
    },
    "half-yearly": { price: "₹96,999", originalPrice: "", savings: "" },
    description: "Complete solution for large hospitals",
    features: [
      "Everything in Super Plan",
      "1k+ patients accounts",
      "50+ licensed doctors accounts",
      "15+ receptionist accounts",
      "20+ pharmacy accounts",
      "25+ lab technician accounts",
      "150 GB Storage",
      "Flexible SLA options",
    ],
  },
};

export function PricingSection({ plans, modules }: PricingSectionProps) {
  const [modulePlanTier, setModulePlanTier] = useState<ModulePlanTier>("base");
  const [packageBilling, setPackageBilling] = useState<BillingPeriod>("yearly");

  // Module Plan Tier toggle component (Base Plan / Super Plan)
  const ModulePlanToggle = ({
    value,
    onChange,
    className = "",
  }: {
    value: ModulePlanTier;
    onChange: (value: ModulePlanTier) => void;
    className?: string;
  }) => (
    <div
      className={`inline-flex items-center bg-gray-100 rounded-full p-1 ${className}`}
    >
      <button
        onClick={() => onChange("base")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          value === "base"
            ? "bg-white text-blue-600 shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Base Plan
      </button>
      <button
        onClick={() => onChange("super")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
          value === "super"
            ? "bg-white text-blue-600 shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Super Plan
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
          Premium
        </span>
      </button>
    </div>
  );

  // Billing toggle component for packages
  const BillingToggle = ({
    value,
    onChange,
    className = "",
  }: {
    value: BillingPeriod;
    onChange: (value: BillingPeriod) => void;
    className?: string;
  }) => (
    <div
      className={`inline-flex items-center bg-gray-100 rounded-full p-1 ${className}`}
    >
      <button
        onClick={() => onChange("half-yearly")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          value === "half-yearly"
            ? "bg-white text-blue-600 shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Half-Yearly
      </button>
      <button
        onClick={() => onChange("yearly")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
          value === "yearly"
            ? "bg-white text-blue-600 shadow-md"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Yearly
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          Save 17%
        </span>
      </button>
    </div>
  );

  // Get module price based on plan tier (base/super)
  const getModulePrice = (module: any) => {
    const moduleName = module.planName || "";
    const pricing =
      defaultModulePricing[moduleName as keyof typeof defaultModulePricing];
    if (pricing) {
      return pricing[modulePlanTier];
    }
    // Fallback to module's own price if no matching pricing found
    const originalPrice = module.price || "₹10,000";
    if (modulePlanTier === "super") {
      return {
        price: originalPrice,
        savings: "Best Value",
        description: "All features + priority support",
        features: module.features || [],
      };
    } else {
      // Base plan is roughly 60% of super plan price
      const priceNum = parseInt(originalPrice.replace(/[₹,]/g, "")) || 10000;
      const basePrice = Math.round(priceNum * 0.6);
      return {
        price: `₹${basePrice.toLocaleString("en-IN")}`,
        savings: "",
        description: "Essential features",
        features: module.features?.slice(0, 4) || [],
      };
    }
  };

  // Get package price based on billing period
  const getPackagePrice = (packageName: string) => {
    const pricing =
      defaultPackagePricing[packageName as keyof typeof defaultPackagePricing];
    if (pricing) {
      return {
        ...pricing[packageBilling],
        description: pricing.description,
        features: pricing.features,
        isPopular: (pricing as any).isPopular || false,
      };
    }
    return {
      price: "Contact Us",
      originalPrice: "",
      savings: "",
      description: "",
      features: [],
      isPopular: false,
    };
  };

  // Default modules if none provided
  const displayModules =
    modules.length > 0
      ? modules
      : [
          { _id: "1", planName: "OPD Management", icon: "Users" },
          { _id: "2", planName: "IPD Management", icon: "Stethoscope" },
          { _id: "3", planName: "Lab Management", icon: "Beaker" },
          { _id: "4", planName: "Pharmacy Management", icon: "Pill" },
        ];

  return (
    <section className="section-padding bg-white">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Flexible Module-Based Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose individual modules or get all 4 integrated. Scale as you
              grow.
            </p>
          </div>
        </ScrollReveal>

        {/* Individual Modules Section */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Individual Modules
              </h3>
              <p className="text-gray-600 mb-6">
                Pick and choose the modules you need. Perfect for specific
                departmental needs.
              </p>
              <ModulePlanToggle
                value={modulePlanTier}
                onChange={setModulePlanTier}
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {displayModules.map((module: any, idx) => {
              const iconName = module.planName?.split(" ")[0] || "Users";
              const Icon = iconMap[iconName] || Users;
              const pricing = getModulePrice(module);

              return (
                <ScrollReveal key={module._id || idx} delay={idx * 80}>
                  <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-white">
                    <div
                      className={`w-14 h-14 rounded-lg ${module.iconColor || "bg-blue-100 text-blue-600"} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={28} />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {module.planName}
                    </h4>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-blue-600">
                        {pricing.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">/month</span>
                      {pricing.savings && (
                        <div className="text-xs text-purple-600 font-semibold mt-1">
                          {pricing.savings}
                        </div>
                      )}
                      {pricing.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {pricing.description}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                          Features
                        </p>
                        <ul className="space-y-2">
                          {pricing.features?.map(
                            (feature: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <Check
                                  size={14}
                                  className="text-blue-600 flex-shrink-0 mt-1"
                                />
                                <span>{feature}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <button className="w-full mt-6 py-2 rounded-lg bg-gray-50 text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm">
                      {module.ctaText || "Learn More"}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* All-in-One Packages Section */}
        <div>
          <ScrollReveal>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                All-in-One Packages
              </h3>
              <p className="text-gray-600 mb-6">
                Get multiple modules bundled together at discounted rates. Best
                value for comprehensive solutions.
              </p>
              <BillingToggle
                value={packageBilling}
                onChange={setPackageBilling}
              />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-12">
            {Object.entries(defaultPackagePricing).map(([packageName], idx) => {
              const packageData = getPackagePrice(packageName);

              return (
                <ScrollReveal key={packageName} delay={idx * 100}>
                  <div
                    className={`relative rounded-xl transition-all duration-300 h-full flex flex-col ${
                      packageData.isPopular
                        ? "md:scale-105 border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-2xl"
                        : "border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300"
                    }`}
                  >
                    {packageData.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="p-8 space-y-6 flex-grow flex flex-col">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                          {packageName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {packageData.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-blue-600">
                              {packageData.price}
                            </span>
                            <span className="text-gray-500">
                              /
                              {packageBilling === "yearly"
                                ? "year"
                                : "6 months"}
                            </span>
                          </div>
                          {packageData.originalPrice && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-400 line-through">
                                {packageData.originalPrice}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                {packageData.savings}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            + Taxes applicable
                          </p>
                        </div>
                      </div>

                      <button
                        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group ${
                          packageData.isPopular
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
                            : "bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        Get Started
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>

                      <div className="pt-6 border-t border-gray-200 flex-grow">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-4">
                          What&apos;s Included
                        </p>
                        <ul className="space-y-3">
                          {packageData.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Check size={14} className="text-blue-600" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 md:p-12 text-center border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Need a Custom Solution?
              </h4>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Contact our sales team for tailored enterprise solutions with
                dedicated support and custom integrations.
              </p>
              <EnterpriseInquiryDialog
                trigger={
                  <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 group">
                    Contact Sales
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                }
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
