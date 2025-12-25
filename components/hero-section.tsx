'use client';

import { MacbookShowcase } from './macbook-showcase';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

interface HeroData {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  backgroundImage?: {
    imageUpload?: any;
    imageUrl?: string;
  };
}

interface HeroSectionProps {
  data: HeroData | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  const slides = [
    {
      title: 'Pharmacy Dashboard',
      description: 'Real-time inventory tracking, automated reordering, and AI-powered demand forecasting',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
    {
      title: 'Hospital Management',
      description: 'Unified patient records, bed management, and integrated billing across departments',
      image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
    {
      title: 'Reception & Queue',
      description: 'Smart appointment scheduling with AI-powered queue optimization and patient flow',
      image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
    {
      title: 'Lab Analytics',
      description: 'Automated test tracking, result processing, and quality assurance dashboards',
      image: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop',
    },
  ];

  const title = data?.title || 'Real Healthcare Control.';
  const subtitle = data?.subtitle || 'Real Time.';
  const description = data?.description || 'Unified pharmacy and hospital management with native AI intelligence. See your entire operation in real-time dashboards. Built for Indian regulations, designed for global scale.';
  const ctaText = data?.ctaText || 'Request Demo';

  return (
    <section className="relative min-h-screen pt-32 pb-8 overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 right-1/3 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="section-max-width section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                <p className="text-sm font-semibold text-blue-700">AI-Native Healthcare Platform</p>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
                {title}{' '}
                <span className="text-blue-600">{subtitle}</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center group">
                {ctaText}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
                See Dashboard
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-600 mt-1">Integrated Modules</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">99.9%</p>
                <p className="text-sm text-gray-600 mt-1">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600 mt-1">AI Operations</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <MacbookShowcase slides={slides} />
          </div>
        </div>

        <div className="lg:hidden">
          <MacbookShowcase slides={slides} />
        </div>
      </div>
    </section>
  );
}
