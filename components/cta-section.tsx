'use client';

import ScrollReveal from './scroll-reveal';
import { MacbookShowcase } from './macbook-showcase';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const slides = [
    {
      title: 'Real-time Analytics',
      description: 'See your entire operation at a glance with unified dashboards',
      image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
    {
      title: 'Automated Workflows',
      description: 'AI handles routine tasks so your team focuses on patient care',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
    {
      title: 'Compliance Built-in',
      description: 'Every transaction logged and auditable for regulatory peace of mind',
      image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
  ];

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
                Ready to Transform Your Healthcare Operations?
              </h2>

              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Join forward-thinking healthcare organizations already using KaeroCare to reduce costs, improve patient care, and scale with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button className="px-8 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center group">
                  Book a Demo
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors">
                  Start Free Trial
                </button>
              </div>

              <p className="text-sm text-gray-400">
                No credit card required. Get access to all Starter features for 30 days.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
