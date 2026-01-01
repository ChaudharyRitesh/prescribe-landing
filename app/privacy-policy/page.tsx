"use client";

import Header from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Bell,
  UserCheck,
  FileText,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: January 1, 2026
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <h2 className="font-semibold text-gray-900 mb-4">
              Quick Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  icon: Database,
                  label: "Data Collection",
                  href: "#data-collection",
                },
                { icon: Lock, label: "Data Security", href: "#data-security" },
                { icon: UserCheck, label: "Your Rights", href: "#your-rights" },
                { icon: Globe, label: "International", href: "#international" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-sm"
                >
                  <item.icon size={16} className="text-blue-600" />
                  <span className="text-gray-700">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                KaeroPrescribe (&quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;), a product of Kaero Group, is committed to
                protecting your privacy and ensuring the security of your
                personal and health information. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information
                when you use our healthcare management platform.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                This policy complies with applicable data protection laws
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                <li>
                  <strong>India:</strong> Information Technology Act, 2000; IT
                  (Reasonable Security Practices and Procedures and Sensitive
                  Personal Data or Information) Rules, 2011; Digital Personal
                  Data Protection Act, 2023 (DPDP Act)
                </li>
                <li>
                  <strong>International:</strong> General Data Protection
                  Regulation (GDPR) for EU/EEA users; Health Insurance
                  Portability and Accountability Act (HIPAA) for US healthcare
                  data
                </li>
                <li>
                  <strong>Healthcare Standards:</strong> National Health
                  Authority guidelines, Clinical Establishments Act requirements
                </li>
              </ul>
            </section>

            <section id="data-collection" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Database className="text-blue-600" size={28} />
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.1 Personal Information
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Name, date of birth, gender, and contact information</li>
                <li>
                  Government-issued identification numbers (Aadhaar, PAN,
                  Passport - as required)
                </li>
                <li>Address and demographic information</li>
                <li>Emergency contact details</li>
                <li>Insurance and billing information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.2 Sensitive Personal Data (Health Information)
              </h3>
              <p className="text-gray-600 mb-4">
                Under Indian law, health data is classified as &quot;Sensitive
                Personal Data or Information&quot; (SPDI). We collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Medical history and health records</li>
                <li>Diagnosis, treatment plans, and prescriptions</li>
                <li>Laboratory test results and medical imaging</li>
                <li>Vaccination records and allergies</li>
                <li>Mental health information (where applicable)</li>
                <li>
                  Biometric data for patient identification (with explicit
                  consent)
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.3 Technical Information
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>IP address, browser type, and device information</li>
                <li>Usage logs, access times, and feature interactions</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="text-blue-600" size={28} />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We process your data for the following purposes:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.1 Healthcare Services
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Providing and managing healthcare services through our
                  platform
                </li>
                <li>
                  Facilitating communication between patients and healthcare
                  providers
                </li>
                <li>
                  Processing prescriptions and managing medication records
                </li>
                <li>Coordinating laboratory tests and diagnostic services</li>
                <li>Managing hospital admissions, appointments, and billing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.2 Platform Operations
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Account creation and authentication</li>
                <li>Customer support and service improvement</li>
                <li>Security monitoring and fraud prevention</li>
                <li>Compliance with legal and regulatory requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.3 Legal Basis for Processing (GDPR/DPDP Compliance)
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Consent:</strong> For health data processing and
                  marketing communications
                </li>
                <li>
                  <strong>Contract:</strong> To provide services you&apos;ve
                  requested
                </li>
                <li>
                  <strong>Legal Obligation:</strong> Compliance with healthcare
                  regulations and reporting requirements
                </li>
                <li>
                  <strong>Vital Interests:</strong> Emergency medical situations
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> Platform security and
                  service improvement
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-600 mb-4">
                We may share your information with:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.1 Healthcare Providers
              </h3>
              <p className="text-gray-600">
                Doctors, nurses, laboratories, pharmacies, and other healthcare
                professionals involved in your care, as authorized by you or
                required for treatment.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.2 Service Providers
              </h3>
              <p className="text-gray-600">
                Third-party vendors who assist with hosting, analytics, payment
                processing, and other operational services (under strict
                confidentiality agreements).
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.3 Legal and Regulatory Bodies
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Government authorities as required by law</li>
                <li>National Health Authority for health record integration</li>
                <li>
                  Insurance companies for claims processing (with consent)
                </li>
                <li>
                  Law enforcement agencies pursuant to valid legal process
                </li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <p className="text-yellow-800 font-medium">Important Notice</p>
                <p className="text-yellow-700 text-sm mt-2">
                  We will NEVER sell your personal or health information to
                  third parties for marketing or commercial purposes.
                </p>
              </div>
            </section>

            <section id="data-security" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Lock className="text-blue-600" size={28} />
                5. Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement comprehensive security measures in accordance with
                ISO 27001 standards and IT Act requirements:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.1 Technical Safeguards
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Multi-factor authentication (MFA) for all accounts</li>
                <li>Regular security audits and penetration testing</li>
                <li>Intrusion detection and prevention systems</li>
                <li>Automated backup with disaster recovery capabilities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.2 Administrative Safeguards
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Role-based access controls (RBAC)</li>
                <li>
                  Employee background checks and confidentiality agreements
                </li>
                <li>Regular security awareness training</li>
                <li>Incident response and breach notification procedures</li>
                <li>Data access logging and audit trails</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.3 Physical Safeguards
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Biometric access controls for server facilities</li>
                <li>Environmental controls and redundant power systems</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-600 mb-4">
                We retain your data in accordance with legal requirements:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Medical Records:</strong> Minimum 3 years from last
                  treatment (as per Indian Medical Council regulations), or
                  longer as required by state laws
                </li>
                <li>
                  <strong>Billing Records:</strong> 8 years (as per tax
                  regulations)
                </li>
                <li>
                  <strong>Account Information:</strong> Duration of account plus
                  2 years after deletion request
                </li>
                <li>
                  <strong>Audit Logs:</strong> 7 years for compliance purposes
                </li>
              </ul>
            </section>

            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <UserCheck className="text-blue-600" size={28} />
                7. Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                Under the DPDP Act 2023, GDPR, and other applicable laws, you
                have the following rights:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: "Right to Access",
                    desc: "Request a copy of your personal data",
                  },
                  {
                    title: "Right to Correction",
                    desc: "Request correction of inaccurate data",
                  },
                  {
                    title: "Right to Erasure",
                    desc: "Request deletion of your data (subject to legal retention requirements)",
                  },
                  {
                    title: "Right to Portability",
                    desc: "Receive your data in a structured, machine-readable format",
                  },
                  {
                    title: "Right to Withdraw Consent",
                    desc: "Withdraw consent at any time for consent-based processing",
                  },
                  {
                    title: "Right to Object",
                    desc: "Object to processing based on legitimate interests",
                  },
                  {
                    title: "Right to Nominate",
                    desc: "Nominate a person to exercise rights on your behalf (DPDP Act)",
                  },
                  {
                    title: "Right to Grievance Redressal",
                    desc: "Lodge complaints with our Data Protection Officer or regulatory authorities",
                  },
                ].map((right) => (
                  <div key={right.title} className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">
                      {right.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{right.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 mt-6">
                To exercise any of these rights, please contact our Data
                Protection Officer at{" "}
                <a
                  href="mailto:privacy@kaerogroup.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@kaerogroup.com
                </a>
              </p>
            </section>

            <section id="international" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="text-blue-600" size={28} />
                8. International Data Transfers
              </h2>
              <p className="text-gray-600 mb-4">
                Your data is primarily stored and processed in India. If we
                transfer data internationally, we ensure adequate protection
                through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Standard Contractual Clauses (SCCs) approved by the European
                  Commission
                </li>
                <li>Binding Corporate Rules where applicable</li>
                <li>
                  Compliance with cross-border data transfer regulations under
                  DPDP Act
                </li>
                <li>
                  Ensuring recipient countries provide adequate data protection
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Cookies and Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for platform
                  functionality and security
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> To understand usage
                  patterns and improve services
                </li>
                <li>
                  <strong>Preference Cookies:</strong> To remember your settings
                  and preferences
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can manage cookie preferences through your browser settings.
                Note that disabling essential cookies may affect platform
                functionality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600">
                Our platform may process data of minors (under 18 years) only
                with verifiable parental or guardian consent, in compliance with
                the DPDP Act. Healthcare providers are responsible for obtaining
                appropriate consent when treating minor patients.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Bell className="text-blue-600" size={28} />
                11. Changes to This Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy periodically. We will notify
                you of material changes via email or platform notification at
                least 30 days before the changes take effect. Your continued use
                of the platform after changes constitutes acceptance of the
                updated policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FileText className="text-blue-600" size={28} />
                12. Contact Information
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Data Protection Officer
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Name:</strong> Data Protection Office, Kaero Group
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@kaerogroup.com"
                      className="text-blue-600 hover:underline"
                    >
                      privacy@kaerogroup.com
                    </a>
                  </p>
                  <p>
                    <strong>Address:</strong> Kolkata, West Bengal, India
                  </p>
                </div>

                <h3 className="font-semibold text-gray-900 mb-4 mt-6">
                  Grievance Officer (as per IT Act)
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:grievance@kaerogroup.com"
                      className="text-blue-600 hover:underline"
                    >
                      grievance@kaerogroup.com
                    </a>
                  </p>
                  <p>
                    <strong>Response Time:</strong> Within 30 days of receipt of
                    complaint
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Regulatory Compliance
              </h2>
              <p className="text-gray-600 mb-4">This policy complies with:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Information Technology Act, 2000 and its amendments</li>
                <li>
                  IT (Reasonable Security Practices and Procedures and Sensitive
                  Personal Data or Information) Rules, 2011
                </li>
                <li>Digital Personal Data Protection Act, 2023</li>
                <li>
                  Indian Medical Council (Professional Conduct, Etiquette and
                  Ethics) Regulations, 2002
                </li>
                <li>
                  Clinical Establishments (Registration and Regulation) Act,
                  2010
                </li>
                <li>
                  General Data Protection Regulation (GDPR) - for EU/EEA users
                </li>
                <li>
                  Health Insurance Portability and Accountability Act (HIPAA) -
                  for US healthcare data
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
