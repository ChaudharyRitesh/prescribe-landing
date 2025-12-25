import Header from '@/components/header';
import { HeroSectionWrapper } from '@/components/hero-section-wrapper';
import { ModulesShowcaseWrapper } from '@/components/modules-showcase-wrapper';
import { FeaturesSectionWrapper } from '@/components/features-section-wrapper';
import { ComparisonSectionWrapper } from '@/components/comparison-section-wrapper';
import { PricingSectionWrapper } from '@/components/pricing-section-wrapper';
import { CTASectionWrapper } from '@/components/cta-section-wrapper';
import { TrustSectionWrapper } from '@/components/trust-section-wrapper';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSectionWrapper />
      <ModulesShowcaseWrapper />
      <FeaturesSectionWrapper />
      <ComparisonSectionWrapper />
      <PricingSectionWrapper />
      <CTASectionWrapper />

      <TrustSectionWrapper />

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
