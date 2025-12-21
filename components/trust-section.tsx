'use client'

import ScrollReveal from './scroll-reveal'
import { Shield } from 'lucide-react'

export function TrustSection() {
  return (
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
  )
}
