"use client";

import ScrollReveal from "./scroll-reveal";
import {
  Check,
  ArrowRight,
  Users,
  Stethoscope,
  Beaker,
  Pill,
} from "lucide-react";
import type { PricingPlan } from '@/lib/sanity.types';

interface PricingSectionProps {
  plans: PricingPlan[]
  modules: PricingPlan[]
}

const iconMap: Record<string, any> = {
  Users,
  Stethoscope,
  Beaker,
  Pill
};

export function PricingSection({ plans, modules }: PricingSectionProps) {
  console.log('Plans:', plans);
  console.log('Modules:', modules);

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

        {/* Modules Grid */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Individual Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, idx) => {
              const iconName = module.planName?.split(' ')[0] || 'Users';
              const Icon = iconMap[iconName] || Users;
              return (
                <ScrollReveal key={module._id} delay={idx * 80}>
                  <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-white">
                    <div
                      className={`w-14 h-14 rounded-lg ${module.iconColor || 'bg-blue-100 text-blue-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={28} />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {module.planName}
                    </h4>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-blue-600">
                        {module.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">/{module.billingPeriod}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                          Features
                        </p>
                        <ul className="space-y-2">
                          {module.features?.slice(0, 4).map((feature, i) => (
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
                          ))}
                          {(module.features?.length || 0) > 4 && (
                            <li className="text-xs text-gray-500 pt-1">
                              +{(module.features?.length || 0) - 4} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {module.addons && module.addons.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                            Add-ons
                          </p>
                          <ul className="space-y-1">
                            {module.addons.map((addon, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-xs text-gray-600"
                              >
                                <span className="text-blue-600 font-bold">
                                  +
                                </span>
                                {addon}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button className="w-full mt-6 py-2 rounded-lg bg-gray-50 text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm">
                      {module.ctaText || 'Learn More'}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Plans from Sanity */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            All-in-One Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, idx) => (
              <ScrollReveal key={plan._id} delay={idx * 100}>
                <div
                  className={`relative rounded-xl transition-all duration-300 ${
                    plan.isPopular
                      ? "md:scale-105 border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-2xl"
                      : "border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-8">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.planName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-6">
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-blue-600">
                            {plan.price}
                          </span>
                          <span className="text-gray-600">/{plan.billingPeriod}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          + Taxes applicable
                        </p>
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {plan.ctaText || 'Get Started'}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>

                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-4">
                        What's Included
                      </p>
                      <ul className="space-y-3">
                        {plan.features?.map((feature, i) => (
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
            ))}
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
              <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 group">
                Contact Sales
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
