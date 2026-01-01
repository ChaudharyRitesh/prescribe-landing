"use client";

import Header from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Shield,
  Lock,
  FileCheck,
  Users,
  AlertTriangle,
  Server,
  Key,
  Eye,
  ClipboardCheck,
  Building2,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Compliance() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Healthcare Compliance
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our commitment to HIPAA, Indian healthcare regulations, and
              international data protection standards
            </p>
            <p className="text-gray-500 mt-4">Last updated: January 1, 2026</p>
          </div>

          {/* Compliance Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              {
                name: "HIPAA",
                desc: "Compliant",
                icon: Shield,
                color: "green",
              },
              {
                name: "DPDP Act",
                desc: "Compliant",
                icon: FileCheck,
                color: "blue",
              },
              {
                name: "ISO 27001",
                desc: "Aligned",
                icon: Lock,
                color: "purple",
              },
              { name: "GDPR", desc: "Ready", icon: Globe, color: "indigo" },
            ].map((badge) => (
              <div
                key={badge.name}
                className={`bg-${badge.color}-50 border border-${badge.color}-200 rounded-xl p-4 text-center`}
              >
                <badge.icon
                  className={`w-8 h-8 text-${badge.color}-600 mx-auto mb-2`}
                />
                <p className="font-bold text-gray-900">{badge.name}</p>
                <p className={`text-sm text-${badge.color}-600`}>
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                KaeroPrescribe is designed and operated with healthcare
                compliance at its core. As a healthcare management platform
                handling sensitive patient information, we adhere to the highest
                standards of data protection and security, meeting both Indian
                regulatory requirements and international healthcare standards
                including HIPAA (Health Insurance Portability and Accountability
                Act).
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                This document outlines our compliance framework, security
                measures, and the safeguards we implement to protect Protected
                Health Information (PHI) and ensure the integrity of healthcare
                data processed through our platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Building2 className="text-blue-600" size={28} />
                2. Indian Healthcare Regulatory Compliance
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.1 Information Technology Act, 2000
              </h3>
              <p className="text-gray-600 mb-4">We comply with:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Section 43A: Compensation for failure to protect sensitive
                  personal data
                </li>
                <li>
                  Section 72A: Disclosure of information in breach of lawful
                  contract
                </li>
                <li>
                  IT (Reasonable Security Practices and Procedures and Sensitive
                  Personal Data or Information) Rules, 2011
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.2 Digital Personal Data Protection Act, 2023 (DPDP Act)
              </h3>
              <p className="text-gray-600 mb-4">
                Our compliance measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Consent Management:</strong> Clear, informed consent
                  mechanisms for all data processing
                </li>
                <li>
                  <strong>Purpose Limitation:</strong> Data used only for
                  specified, legitimate purposes
                </li>
                <li>
                  <strong>Data Minimization:</strong> Collection limited to what
                  is necessary
                </li>
                <li>
                  <strong>Data Principal Rights:</strong> Tools for access,
                  correction, erasure, and portability
                </li>
                <li>
                  <strong>Data Fiduciary Obligations:</strong> Robust security
                  and accountability measures
                </li>
                <li>
                  <strong>Cross-border Transfer:</strong> Compliance with
                  transfer restrictions to notified countries
                </li>
                <li>
                  <strong>Children&apos;s Data:</strong> Verifiable parental
                  consent for minors
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.3 Clinical Establishments Act, 2010
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Support for registration and compliance requirements</li>
                <li>
                  Maintenance of minimum standards for healthcare facilities
                </li>
                <li>Record-keeping as per prescribed formats and durations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.4 Indian Medical Council Regulations
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Compliance with Professional Conduct, Etiquette and Ethics
                  Regulations, 2002
                </li>
                <li>
                  Support for telemedicine guidelines (Telemedicine Practice
                  Guidelines, 2020)
                </li>
                <li>Prescription standards and documentation requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                2.5 Drugs and Cosmetics Act, 1940
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Schedule H and H1 drug dispensing controls</li>
                <li>Narcotic and psychotropic substance tracking</li>
                <li>Pharmacovigilance reporting capabilities</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="text-green-600" size={28} />
                3. HIPAA Compliance
              </h2>
              <p className="text-gray-600 mb-6">
                While HIPAA is a U.S. regulation, we implement HIPAA-compliant
                safeguards as they represent global best practices for
                healthcare data protection. For clients handling U.S. patient
                data or requiring HIPAA compliance, we provide:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.1 Administrative Safeguards
              </h3>
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Security Management Process",
                      desc: "Risk analysis, risk management, sanction policies, and information system activity review",
                    },
                    {
                      title: "Assigned Security Responsibility",
                      desc: "Designated Security Officer responsible for HIPAA compliance",
                    },
                    {
                      title: "Workforce Security",
                      desc: "Authorization and supervision procedures, clearance procedures, termination procedures",
                    },
                    {
                      title: "Information Access Management",
                      desc: "Access authorization, access establishment and modification policies",
                    },
                    {
                      title: "Security Awareness Training",
                      desc: "Regular training programs, security reminders, malware protection, login monitoring",
                    },
                    {
                      title: "Security Incident Procedures",
                      desc: "Response and reporting procedures for security incidents",
                    },
                    {
                      title: "Contingency Plan",
                      desc: "Data backup, disaster recovery, emergency mode operations, testing and revision",
                    },
                    {
                      title: "Evaluation",
                      desc: "Periodic technical and non-technical evaluations",
                    },
                    {
                      title: "Business Associate Agreements",
                      desc: "Contracts with all third parties handling PHI",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900">
                          {item.title}:
                        </span>{" "}
                        <span className="text-gray-600">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.2 Physical Safeguards
              </h3>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Facility Access Controls",
                      desc: "Contingency operations, facility security plan, access control and validation",
                    },
                    {
                      title: "Workstation Use & Security",
                      desc: "Policies for workstation functions and physical access restrictions",
                    },
                    {
                      title: "Device and Media Controls",
                      desc: "Disposal, media re-use, accountability, data backup and storage",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900">
                          {item.title}:
                        </span>{" "}
                        <span className="text-gray-600">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.3 Technical Safeguards
              </h3>
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Access Control",
                      desc: "Unique user identification, emergency access procedures, automatic logoff, encryption and decryption",
                    },
                    {
                      title: "Audit Controls",
                      desc: "Hardware, software, and procedural mechanisms to record and examine system activity",
                    },
                    {
                      title: "Integrity Controls",
                      desc: "Policies and procedures to protect ePHI from improper alteration or destruction",
                    },
                    {
                      title: "Person or Entity Authentication",
                      desc: "Verification of person or entity seeking access to ePHI",
                    },
                    {
                      title: "Transmission Security",
                      desc: "Integrity controls and encryption for ePHI transmitted over networks",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900">
                          {item.title}:
                        </span>{" "}
                        <span className="text-gray-600">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                3.4 Business Associate Agreement (BAA)
              </h3>
              <p className="text-gray-600">
                For organizations requiring HIPAA compliance, we execute
                Business Associate Agreements that define our obligations as a
                Business Associate, including PHI handling, breach notification,
                and subcontractor requirements. Contact{" "}
                <a
                  href="mailto:compliance@kaerogroup.com"
                  className="text-blue-600 hover:underline"
                >
                  compliance@kaerogroup.com
                </a>{" "}
                for BAA execution.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="text-indigo-600" size={28} />
                4. International Standards Compliance
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.1 GDPR Compliance (EU/EEA Users)
              </h3>
              <p className="text-gray-600 mb-4">
                For users in the European Union or European Economic Area, we
                provide:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Lawful basis for processing (consent, contract, legitimate
                  interests)
                </li>
                <li>
                  Data subject rights implementation (access, rectification,
                  erasure, portability, objection)
                </li>
                <li>
                  Data Protection Impact Assessments (DPIA) for high-risk
                  processing
                </li>
                <li>
                  Standard Contractual Clauses (SCCs) for international
                  transfers
                </li>
                <li>72-hour breach notification to supervisory authorities</li>
                <li>Records of processing activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.2 ISO 27001 Alignment
              </h3>
              <p className="text-gray-600 mb-4">
                Our information security management system aligns with ISO
                27001:2022 requirements:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Information security policies and procedures</li>
                <li>Asset management and classification</li>
                <li>Access control and cryptography</li>
                <li>Operations security and communications security</li>
                <li>Supplier relationships and incident management</li>
                <li>Business continuity management</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                4.3 HL7 FHIR Standards
              </h3>
              <p className="text-gray-600">
                We support HL7 FHIR (Fast Healthcare Interoperability Resources)
                standards for healthcare data exchange, enabling seamless
                integration with other healthcare systems and ensuring data
                portability.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Lock className="text-blue-600" size={28} />
                5. Security Controls
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.1 Encryption
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Standard
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Application
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Data at Rest
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        AES-256
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        All stored PHI and sensitive data
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Data in Transit
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        TLS 1.3
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        All network communications
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Database
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Transparent Data Encryption
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Database files and backups
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Key Management
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        HSM/KMS
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Cryptographic key protection
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.2 Access Controls
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Role-Based Access Control (RBAC):</strong> Permissions
                  based on job function and minimum necessary access
                </li>
                <li>
                  <strong>Multi-Factor Authentication (MFA):</strong> Required
                  for all users accessing PHI
                </li>
                <li>
                  <strong>Session Management:</strong> Automatic timeout after
                  inactivity, secure session handling
                </li>
                <li>
                  <strong>Unique User Identification:</strong> Individual
                  accounts with no shared credentials
                </li>
                <li>
                  <strong>Password Policies:</strong> Strong password
                  requirements, periodic rotation, no reuse
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.3 Audit Logging
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Comprehensive logging of all access to PHI</li>
                <li>User activity monitoring and anomaly detection</li>
                <li>Immutable audit trails with timestamps</li>
                <li>Log retention for minimum 7 years</li>
                <li>Regular audit log reviews</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                5.4 Network Security
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Web Application Firewall (WAF)</li>
                <li>Intrusion Detection and Prevention Systems (IDS/IPS)</li>
                <li>DDoS protection</li>
                <li>Network segmentation</li>
                <li>Regular vulnerability scanning and penetration testing</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="text-orange-600" size={28} />
                6. Breach Notification
              </h2>
              <p className="text-gray-600 mb-4">
                In the event of a security breach affecting PHI, we follow
                strict notification procedures:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.1 Indian Law Requirements
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Notification to CERT-In as required under IT Act</li>
                <li>
                  Notification to Data Protection Board as required under DPDP
                  Act
                </li>
                <li>
                  Notification to affected data principals without unreasonable
                  delay
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.2 HIPAA Requirements (for covered entities)
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  Notification to covered entity within 24 hours of discovery
                </li>
                <li>
                  Support for covered entity&apos;s 60-day notification to
                  affected individuals
                </li>
                <li>
                  Notification to HHS for breaches affecting 500+ individuals
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.3 GDPR Requirements (for EU data subjects)
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>72-hour notification to supervisory authority</li>
                <li>
                  Without undue delay notification to affected individuals (for
                  high-risk breaches)
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                6.4 Breach Response Process
              </h3>
              <div className="bg-orange-50 rounded-xl p-6">
                <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                  <li>
                    <strong>Identification:</strong> Detection and initial
                    assessment of the incident
                  </li>
                  <li>
                    <strong>Containment:</strong> Immediate steps to limit the
                    breach scope
                  </li>
                  <li>
                    <strong>Investigation:</strong> Forensic analysis to
                    determine cause and extent
                  </li>
                  <li>
                    <strong>Notification:</strong> Timely notification to
                    authorities and affected parties
                  </li>
                  <li>
                    <strong>Remediation:</strong> Corrective actions to prevent
                    recurrence
                  </li>
                  <li>
                    <strong>Documentation:</strong> Complete documentation of
                    incident and response
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <ClipboardCheck className="text-blue-600" size={28} />
                7. Compliance Verification
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.1 Internal Audits
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Quarterly internal security assessments</li>
                <li>Annual comprehensive compliance audits</li>
                <li>Continuous monitoring and automated compliance checks</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.2 Third-Party Assessments
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Annual third-party security audits</li>
                <li>Regular penetration testing by certified professionals</li>
                <li>Vulnerability assessments and remediation tracking</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                7.3 Compliance Reports
              </h3>
              <p className="text-gray-600">
                Enterprise customers may request compliance reports and evidence
                of security controls. Contact{" "}
                <a
                  href="mailto:compliance@kaerogroup.com"
                  className="text-blue-600 hover:underline"
                >
                  compliance@kaerogroup.com
                </a>{" "}
                for compliance documentation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Users className="text-blue-600" size={28} />
                8. Customer Responsibilities
              </h2>
              <p className="text-gray-600 mb-4">
                Compliance is a shared responsibility. Healthcare Providers
                using KaeroPrescribe are responsible for:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Access Management
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Properly provisioning/de-provisioning users</li>
                    <li>• Enforcing MFA for all staff</li>
                    <li>• Regular access reviews</li>
                    <li>• Protecting user credentials</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Data Handling
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Obtaining patient consent</li>
                    <li>• Accurate data entry</li>
                    <li>• Appropriate data sharing</li>
                    <li>• Secure device usage</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Policy Compliance
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Internal privacy policies</li>
                    <li>• Staff training on data protection</li>
                    <li>• Incident reporting</li>
                    <li>• Regulatory compliance</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Physical Security
                  </h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Secure workstation use</li>
                    <li>• Screen privacy in patient areas</li>
                    <li>• Secure device disposal</li>
                    <li>• Clean desk policies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Server className="text-blue-600" size={28} />
                9. Data Center and Infrastructure
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>
                  <strong>Location:</strong> Primary data centers in India with
                  geographic redundancy
                </li>
                <li>
                  <strong>Certifications:</strong> SOC 2 Type II, ISO 27001
                  certified data centers
                </li>
                <li>
                  <strong>Physical Security:</strong> 24/7 security, biometric
                  access, CCTV surveillance
                </li>
                <li>
                  <strong>Environmental Controls:</strong> Redundant power,
                  cooling, fire suppression
                </li>
                <li>
                  <strong>Disaster Recovery:</strong> Real-time replication,
                  multiple availability zones
                </li>
                <li>
                  <strong>Uptime SLA:</strong> 99.9% availability commitment
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Key className="text-blue-600" size={28} />
                10. Data Retention and Disposal
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                10.1 Retention Periods
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Data Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Retention Period
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                        Legal Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Medical Records
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Minimum 3 years from last treatment
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        IMC Regulations
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Prescription Records
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        3 years
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Drugs & Cosmetics Act
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Financial Records
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        8 years
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Income Tax Act
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Audit Logs
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        7 years
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Compliance requirements
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Consent Records
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Duration of relationship + 7 years
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        DPDP Act
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                10.2 Secure Disposal
              </h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Cryptographic erasure for digital data</li>
                <li>NIST SP 800-88 compliant media sanitization</li>
                <li>Certificate of destruction for physical media</li>
                <li>Documented disposal procedures</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Training and Awareness
              </h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Mandatory HIPAA/privacy training for all employees</li>
                <li>Role-specific security training</li>
                <li>Annual refresher training and certifications</li>
                <li>Phishing simulation and security awareness programs</li>
                <li>Incident response training and tabletop exercises</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="text-blue-600" size={28} />
                12. Contact Information
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Compliance Officer
                    </h3>
                    <div className="space-y-2 text-gray-600 text-sm">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:compliance@kaerogroup.com"
                          className="text-blue-600 hover:underline"
                        >
                          compliance@kaerogroup.com
                        </a>
                      </p>
                      <p>
                        <strong>Response Time:</strong> Within 48 business hours
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Security Team
                    </h3>
                    <div className="space-y-2 text-gray-600 text-sm">
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:security@kaerogroup.com"
                          className="text-blue-600 hover:underline"
                        >
                          security@kaerogroup.com
                        </a>
                      </p>
                      <p>
                        <strong>Security Incidents:</strong> 24/7 monitoring
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                  <p className="text-gray-600 text-sm">
                    Kaero Group, Kolkata, West Bengal, India
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-green-50 rounded-xl p-6 mt-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium mb-2">
                    Our Commitment
                  </p>
                  <p className="text-green-700 text-sm">
                    KaeroPrescribe is committed to maintaining the highest
                    standards of healthcare data protection. We continuously
                    monitor regulatory developments and update our compliance
                    measures to ensure your data remains protected under
                    evolving legal frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
