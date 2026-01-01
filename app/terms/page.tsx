"use client";

import Header from "@/components/header";
import { Footer } from "@/components/footer";
import {
  FileText,
  Scale,
  AlertTriangle,
  CreditCard,
  Shield,
  Ban,
  RefreshCw,
  Gavel,
} from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: January 1, 2026
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
            <p className="text-blue-800 font-medium mb-2">Important</p>
            <p className="text-blue-700 text-sm">
              Please read these Terms of Service carefully before using
              KaeroPrescribe. By accessing or using our platform, you agree to
              be bound by these terms. If you do not agree, please do not use
              our services.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="text-blue-600" size={28} />
                1. Agreement to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) constitute a legally
                binding agreement between you (&quot;User,&quot;
                &quot;you,&quot; or &quot;your&quot;) and Kaero Group
                (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;), governing your access to and use of the
                KaeroPrescribe healthcare management platform, including all
                related applications, services, and websites (collectively, the
                &quot;Platform&quot;).
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                By creating an account, accessing, or using the Platform, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and our Privacy Policy, which is
                incorporated herein by reference.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Definitions
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-3">
                <li>
                  <strong>&quot;Healthcare Provider&quot;</strong> means
                  hospitals, clinics, laboratories, pharmacies, doctors, and
                  other medical professionals using the Platform to deliver
                  healthcare services.
                </li>
                <li>
                  <strong>&quot;Patient&quot;</strong> means individuals
                  receiving healthcare services through providers using the
                  Platform.
                </li>
                <li>
                  <strong>&quot;Administrator&quot;</strong> means authorized
                  personnel managing the Platform for a Healthcare Provider.
                </li>
                <li>
                  <strong>
                    &quot;Protected Health Information (PHI)&quot;
                  </strong>{" "}
                  means any individually identifiable health information as
                  defined under applicable healthcare regulations.
                </li>
                <li>
                  <strong>&quot;Services&quot;</strong> means all features,
                  functionalities, and modules provided through the Platform
                  including OPD, IPD, Laboratory, and Pharmacy management.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Eligibility and Account Registration
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.1 Eligibility Requirements
              </h3>
              <p className="text-gray-600 mb-4">
                To use the Platform, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Be at least 18 years of age (or the age of majority in your
                  jurisdiction)
                </li>
                <li>
                  For Healthcare Providers: Hold valid licenses and
                  registrations as required under the Clinical Establishments
                  Act, 2010, Indian Medical Council Act, or other applicable
                  laws
                </li>
                <li>
                  Have the legal authority to enter into binding agreements
                </li>
                <li>
                  Not be barred from using the services under applicable law
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.2 Account Responsibilities
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials
                </li>
                <li>
                  You must provide accurate, current, and complete information
                  during registration
                </li>
                <li>You must promptly update your information if it changes</li>
                <li>
                  You are solely responsible for all activities under your
                  account
                </li>
                <li>
                  You must immediately notify us of any unauthorized access or
                  security breach
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.3 Account Verification
              </h3>
              <p className="text-gray-600">
                We may require verification of identity, professional
                credentials, or organizational authorization before granting
                access to certain features. Healthcare Providers must provide
                valid registration certificates and licenses as required.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Services Description
              </h2>
              <p className="text-gray-600 mb-4">
                KaeroPrescribe provides a comprehensive healthcare management
                platform including:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: "OPD Management",
                    desc: "Patient registration, appointment scheduling, queue management, and outpatient workflows",
                  },
                  {
                    title: "IPD Management",
                    desc: "Bed management, admission/discharge, treatment plans, and inpatient care coordination",
                  },
                  {
                    title: "Laboratory Management",
                    desc: "Sample tracking, test processing, result management, and report generation",
                  },
                  {
                    title: "Pharmacy Management",
                    desc: "Inventory control, prescription processing, dispensing, and drug interaction alerts",
                  },
                  {
                    title: "Electronic Health Records",
                    desc: "Patient medical history, prescriptions, and clinical documentation",
                  },
                  {
                    title: "Billing & Insurance",
                    desc: "Invoice generation, payment processing, and insurance claim management",
                  },
                ].map((service) => (
                  <div
                    key={service.title}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{service.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="text-blue-600" size={28} />
                5. Fees and Payment
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.1 Subscription Plans
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Services are offered under various subscription plans (Base,
                  Super, Enterprise)
                </li>
                <li>
                  Current pricing is available on our pricing page and may be
                  updated periodically
                </li>
                <li>
                  All prices are exclusive of applicable taxes (GST) unless
                  stated otherwise
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.2 Payment Terms
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Payment is due in advance for the selected billing period
                  (half-yearly or yearly)
                </li>
                <li>
                  We accept payments via UPI, credit/debit cards, net banking,
                  and bank transfers
                </li>
                <li>
                  Invoices will be provided with GST details as per Indian tax
                  regulations
                </li>
                <li>
                  Failure to pay may result in service suspension or termination
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.3 Refund Policy
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Refund requests must be submitted within 7 days of initial
                  subscription
                </li>
                <li>
                  Pro-rata refunds may be considered for annual subscriptions
                  cancelled after 7 days, at our discretion
                </li>
                <li>
                  No refunds for partial month usage or terminated accounts due
                  to Terms violation
                </li>
                <li>Refunds will be processed within 15-30 business days</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.4 Price Changes
              </h3>
              <p className="text-gray-600">
                We reserve the right to modify pricing with 30 days&apos;
                advance notice. Existing subscriptions will continue at the
                current rate until renewal.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Ban className="text-blue-600" size={28} />
                6. Acceptable Use Policy
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.1 Permitted Use
              </h3>
              <p className="text-gray-600">
                You may use the Platform only for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Legitimate healthcare management and delivery purposes</li>
                <li>
                  Activities that comply with all applicable laws and
                  regulations
                </li>
                <li>Purposes authorized by your subscription plan</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.2 Prohibited Conduct
              </h3>
              <p className="text-gray-600 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Use the Platform for any unlawful purpose or in violation of
                  healthcare regulations
                </li>
                <li>
                  Access, tamper with, or use non-public areas of the Platform
                </li>
                <li>
                  Attempt to probe, scan, or test the vulnerability of our
                  systems
                </li>
                <li>Interfere with or disrupt the Platform or servers</li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation
                </li>
                <li>Share login credentials or allow unauthorized access</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>
                  Scrape, data mine, or extract data without authorization
                </li>
                <li>
                  Use the Platform for commercial purposes beyond your
                  subscription
                </li>
                <li>Violate patient privacy or confidentiality obligations</li>
                <li>
                  Create false medical records or fraudulent prescriptions
                </li>
                <li>
                  Engage in any activity that could harm patients or healthcare
                  integrity
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="text-blue-600" size={28} />
                7. Healthcare-Specific Terms
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.1 Healthcare Provider Responsibilities
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Maintain all required professional licenses and registrations
                </li>
                <li>
                  Ensure all staff using the Platform are properly trained and
                  authorized
                </li>
                <li>
                  Comply with Medical Council of India guidelines and
                  professional ethics
                </li>
                <li>Maintain accurate and complete medical records</li>
                <li>Obtain proper patient consent for data processing</li>
                <li>
                  Report adverse events and comply with pharmacovigilance
                  requirements
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.2 Medical Disclaimer
              </h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-800 font-medium">
                  Important Medical Disclaimer
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  KaeroPrescribe is a healthcare management tool and does NOT
                  provide medical advice, diagnosis, or treatment. All clinical
                  decisions remain the sole responsibility of qualified
                  healthcare professionals. The Platform&apos;s suggestions,
                  alerts, or information are supplementary and must be verified
                  by healthcare providers. In case of medical emergency, contact
                  emergency services immediately.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.3 Drug Information
              </h3>
              <p className="text-gray-600">
                Drug information, interaction alerts, and dosage suggestions are
                provided for reference purposes only. Healthcare providers must
                exercise independent professional judgment. We do not guarantee
                completeness or accuracy of drug databases and recommend
                verification from authoritative sources.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Intellectual Property
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8.1 Our Intellectual Property
              </h3>
              <p className="text-gray-600">
                The Platform, including all content, features, functionality,
                software, text, graphics, logos, and trademarks, is owned by
                Kaero Group and protected by Indian and international
                intellectual property laws. You receive a limited,
                non-exclusive, non-transferable license to use the Platform for
                its intended purpose.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8.2 Your Content
              </h3>
              <p className="text-gray-600">
                You retain ownership of data and content you input into the
                Platform. By using the Platform, you grant us a limited license
                to process, store, and display your content solely for providing
                the Services.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                8.3 Feedback
              </h3>
              <p className="text-gray-600">
                Any feedback, suggestions, or ideas you provide about the
                Platform may be used by us without obligation or compensation to
                you.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="text-blue-600" size={28} />
                9. Disclaimers and Limitation of Liability
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9.1 Service Availability
              </h3>
              <p className="text-gray-600">
                The Platform is provided &quot;AS IS&quot; and &quot;AS
                AVAILABLE.&quot; While we strive for 99.9% uptime, we do not
                guarantee uninterrupted, error-free, or secure access. Scheduled
                maintenance will be notified in advance when possible.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9.2 Disclaimer of Warranties
              </h3>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
                WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Warranties of merchantability and fitness for a particular
                  purpose
                </li>
                <li>
                  Warranties that the Platform will meet your specific
                  requirements
                </li>
                <li>
                  Warranties regarding the accuracy or reliability of results
                </li>
                <li>Warranties against infringement of third-party rights</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                9.3 Limitation of Liability
              </h3>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Our total liability shall not exceed the fees paid by you in
                  the 12 months preceding the claim
                </li>
                <li>
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages
                </li>
                <li>
                  We shall not be liable for loss of data, revenue, profits, or
                  business opportunities
                </li>
                <li>
                  We shall not be liable for medical malpractice or clinical
                  decisions made by Healthcare Providers
                </li>
              </ul>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-4">
                <p className="text-gray-700 text-sm">
                  These limitations apply even if we have been advised of the
                  possibility of such damages. Some jurisdictions do not allow
                  the exclusion of certain warranties or limitation of
                  liability, so some of the above may not apply to you.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify, defend, and hold harmless Kaero Group,
                its affiliates, officers, directors, employees, and agents from
                any claims, damages, losses, liabilities, costs, and expenses
                (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Your violation of any third-party rights</li>
                <li>
                  Medical malpractice or negligence by Healthcare Providers
                </li>
                <li>
                  Unauthorized access due to your failure to protect credentials
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <RefreshCw className="text-blue-600" size={28} />
                11. Termination
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11.1 Termination by You
              </h3>
              <p className="text-gray-600">
                You may terminate your account at any time by contacting
                support. You remain responsible for all fees incurred prior to
                termination.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11.2 Termination by Us
              </h3>
              <p className="text-gray-600 mb-4">
                We may suspend or terminate your access immediately if you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Violate these Terms or our policies</li>
                <li>Fail to pay fees when due</li>
                <li>Engage in fraudulent or illegal activity</li>
                <li>Pose a security risk to the Platform or other users</li>
                <li>Receive a court order or regulatory directive</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                11.3 Effect of Termination
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your right to access the Platform ceases immediately</li>
                <li>
                  We will retain your data as required by law and our data
                  retention policy
                </li>
                <li>
                  You may request data export within 30 days of termination
                </li>
                <li>
                  Provisions that should survive termination will remain in
                  effect
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Gavel className="text-blue-600" size={28} />
                12. Dispute Resolution and Governing Law
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12.1 Governing Law
              </h3>
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to conflict of law
                principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12.2 Dispute Resolution
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Informal Resolution:</strong> We encourage you to
                  contact us first to resolve disputes informally
                </li>
                <li>
                  <strong>Mediation:</strong> If informal resolution fails,
                  disputes may be submitted to mediation under the Mediation
                  Act, 2023
                </li>
                <li>
                  <strong>Arbitration:</strong> Unresolved disputes shall be
                  settled by binding arbitration under the Arbitration and
                  Conciliation Act, 1996, with proceedings conducted in English
                  in Kolkata, India
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12.3 Jurisdiction
              </h3>
              <p className="text-gray-600">
                For matters not subject to arbitration, courts in Kolkata, West
                Bengal, India shall have exclusive jurisdiction.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                12.4 Class Action Waiver
              </h3>
              <p className="text-gray-600">
                To the extent permitted by law, all disputes must be brought on
                an individual basis and not as part of any class, collective, or
                representative proceeding.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. General Provisions
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.1 Entire Agreement
              </h3>
              <p className="text-gray-600">
                These Terms, together with the Privacy Policy and any
                service-specific agreements, constitute the entire agreement
                between you and Kaero Group regarding the Platform.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.2 Severability
              </h3>
              <p className="text-gray-600">
                If any provision of these Terms is found unenforceable, the
                remaining provisions shall remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.3 Waiver
              </h3>
              <p className="text-gray-600">
                Our failure to enforce any right or provision shall not be
                deemed a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.4 Assignment
              </h3>
              <p className="text-gray-600">
                You may not assign these Terms without our prior written
                consent. We may assign our rights and obligations to any
                affiliate or successor.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.5 Force Majeure
              </h3>
              <p className="text-gray-600">
                We shall not be liable for delays or failures due to
                circumstances beyond our reasonable control, including natural
                disasters, pandemics, wars, government actions, or
                infrastructure failures.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                13.6 Amendments
              </h3>
              <p className="text-gray-600">
                We may modify these Terms at any time. Material changes will be
                notified via email or platform notification at least 30 days
                before taking effect. Continued use after changes constitutes
                acceptance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Contact Information
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Kaero Group</strong>
                  </p>
                  <p>Kolkata, West Bengal, India</p>
                  <p>
                    <strong>General Inquiries:</strong>{" "}
                    <a
                      href="mailto:support@kaerogroup.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@kaerogroup.com
                    </a>
                  </p>
                  <p>
                    <strong>Legal Notices:</strong>{" "}
                    <a
                      href="mailto:legal@kaerogroup.com"
                      className="text-blue-600 hover:underline"
                    >
                      legal@kaerogroup.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 rounded-xl p-6 mt-12">
              <p className="text-blue-800 font-medium mb-2">Acknowledgment</p>
              <p className="text-blue-700 text-sm">
                By clicking &quot;I Agree,&quot; creating an account, or using
                the Platform, you acknowledge that you have read, understood,
                and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
