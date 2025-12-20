'use client';

import ScrollReveal from './scroll-reveal';
import { Check, ArrowRight, Users, Stethoscope, Beaker, Pill } from 'lucide-react';

const modules = [
  {
    name: 'Reception Module',
    price: '₹750',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    features: [
      'Appointment Booking',
      'Doctors Availability',
      'Queue System',
      'Multi Receptionist Users',
      'Live Dashboard & Status',
      'Live Update/Cancel Booking',
      'Booking History',
    ],
    addons: [
      'Email Notifications',
      'SMS Notifications',
    ],
  },
  {
    name: 'Doctor\'s Module',
    price: '₹1,050',
    icon: Stethoscope,
    color: 'bg-green-100 text-green-600',
    features: [
      'Auto Integration with Reception',
      'Doctors Dashboard',
      'Create Prescription',
      'Print/Export Prescription',
      'Prescription History',
      'Auto Attach to Patient File',
      'Upload Reports & Attachments',
      'Recommend Tests',
      'Multi Doctors Support',
    ],
    addons: [
      'Email & SMS Prescriptions',
    ],
  },
  {
    name: 'Pathlab Module',
    price: '₹950',
    icon: Beaker,
    color: 'bg-purple-100 text-purple-600',
    features: [
      'Lab Dashboard',
      'Auto Test Integration',
      'Report History',
      'Test Catalogues',
      'Generate & Export Reports',
      'Instrument Integration',
      'Upload & Attachments',
      'Multi Technician Support',
    ],
    addons: [
      'Email & SMS Reports',
    ],
  },
  {
    name: 'Pharmacy Module',
    price: '₹1,600',
    icon: Pill,
    color: 'bg-orange-100 text-orange-600',
    features: [
      'Inventory Management',
      'Stock Dashboard',
      'Create Inventory',
      'Auto Prescription Integration',
      'Invoice History',
      'Billing Management',
      'Generate Reports',
      'Auto Order Creation',
      'Top Selling Products',
    ],
    addons: [
      'Payment Gateway Integration',
      'Customer Retainer Plans',
    ],
  },
];

const plans = [
  {
    name: 'Base Plan',
    description: 'Perfect for getting started',
    basePrice: '₹4,350',
    storage: '15 GB/month',
    setupFee: '₹2,999',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Super Plan',
    description: 'Most popular choice',
    basePrice: '₹6,090',
    storage: '25 GB/month',
    setupFee: '₹2,999',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise Plan',
    description: 'For large networks',
    basePrice: '₹8,530',
    storage: '70+ GB/month',
    setupFee: '₹2,999',
    highlighted: false,
    badge: null,
  },
];

export function PricingSection() {
  return (
    <section className="section-padding bg-white">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Flexible Module-Based Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose individual modules or get all 4 integrated. Scale as you grow.
            </p>
          </div>
        </ScrollReveal>

        {/* Modules Grid */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Individual Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, idx) => {
              const Icon = module.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-white">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-lg ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={28} />
                    </div>

                    {/* Title & Price */}
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h4>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-blue-600">{module.price}</span>
                      <span className="text-gray-600 ml-2 text-sm">/month</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Features</p>
                        <ul className="space-y-2">
                          {module.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <Check size={14} className="text-blue-600 flex-shrink-0 mt-1" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {module.features.length > 4 && (
                            <li className="text-xs text-gray-500 pt-1">
                              +{module.features.length - 4} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Add-ons */}
                      {module.addons.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Add-ons</p>
                          <ul className="space-y-1">
                            {module.addons.map((addon, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                <span className="text-blue-600 font-bold">+</span>
                                {addon}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-6 py-2 rounded-lg bg-gray-50 text-gray-900 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm">
                      Learn More
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">All-in-One Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  className={`relative rounded-xl transition-all duration-300 ${
                    plan.highlighted
                      ? 'md:scale-105 border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-2xl'
                      : 'border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-8">
                    {/* Header */}
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold text-blue-600">{plan.basePrice}</span>
                          <span className="text-gray-600">/month</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">+ Taxes applicable</p>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">📦 Storage</span>
                          <span className="font-semibold text-gray-900">{plan.storage}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">🔧 Setup Fee</span>
                          <span className="font-semibold text-gray-900">{plan.setupFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Get Started
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Includes */}
                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-4">What's Included</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">All 4 Modules</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">Multi-user Support</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">Live Dashboards</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Check size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">Email Support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Enterprise CTA */}
          <ScrollReveal>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 md:p-12 text-center border border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Need a Custom Solution?</h4>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Contact our sales team for tailored enterprise solutions with dedicated support and custom integrations.
              </p>
              <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 group">
                Contact Sales
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
