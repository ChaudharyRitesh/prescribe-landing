'use client';

import ScrollReveal from './scroll-reveal';
import { Zap, Users, Clock, BarChart3 } from 'lucide-react';

const modules = [
  {
    title: 'Pharmacy Admin',
    description: 'Inventory & Orders',
    icon: Zap,
    image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Stock tracking', 'Auto-reorder', 'Supplier sync', 'Demand forecast'],
  },
  {
    title: 'Hospital Admin',
    description: 'Patient & Ward Management',
    icon: Users,
    image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Patient records', 'Bed management', 'Staff scheduling', 'Billing sync'],
  },
  {
    title: 'Reception & Ops',
    description: 'Queue & Appointments',
    icon: Clock,
    image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Smart scheduling', 'Queue optimization', 'Patient flow', 'Wait time predict'],
  },
  {
    title: 'Lab Dashboard',
    description: 'Reports & Results',
    icon: BarChart3,
    image: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    features: ['Test tracking', 'Auto reports', 'Quality assurance', 'Result delivery'],
  },
];

export function ModulesShowcase() {
  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50">
      <div className="section-max-width">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Four Modules. One System.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each module is powerful on its own. Together, they create a unified operating system for your entire healthcare operation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group">
                  <div className="relative mb-6 overflow-hidden rounded-xl aspect-video bg-gray-200 shadow-md hover:shadow-lg transition-shadow">
                    <img
                      src={module.image}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{module.title}</h3>
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {module.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
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
