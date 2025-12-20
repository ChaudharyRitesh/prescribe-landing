'use client';

import Header from '@/components/header';
import ScrollReveal from '@/components/scroll-reveal';
import { HeroSection } from '@/components/hero-section';
import { ModulesShowcase } from '@/components/modules-showcase';
import { FeaturesSection } from '@/components/features-section';
import { ComparisonSection } from '@/components/comparison-section';
import { PricingSection } from '@/components/pricing-section';
import { CTASection } from '@/components/cta-section';
import { Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ModulesShowcase />
      <FeaturesSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />

      {/* Trust Section */}
      <section className="section-padding bg-white">
        <div className="section-max-width">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Trust Built In</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Healthcare data demands the highest standards. We don't compromise on security or compliance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Regulated Architecture',
                description: 'Built from the ground up for healthcare compliance. HIPAA-ready foundations. Support for Indian healthcare regulations.',
              },
              {
                title: 'Audit Trails',
                description: 'Every transaction, every access, every change is logged and traceable. Complete compliance documentation.',
              },
              {
                title: 'Data Security',
                description: 'End-to-end encryption at rest and in transit. Regular security audits and penetration testing. Zero-trust architecture.',
              },
              {
                title: 'Disaster Recovery',
                description: 'Multi-region redundancy. Automated backups. RTO < 1 hour. RPO < 15 minutes. Peace of mind built in.',
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="p-8 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <Shield size={24} className="text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="section-max-width section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold mb-4">K</div>
              <p className="text-sm leading-relaxed">AI operating system for modern healthcare. Built for Indian regulations, designed for global scale.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Pharmacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hospital</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reception</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lab</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 KaeroGroup. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
