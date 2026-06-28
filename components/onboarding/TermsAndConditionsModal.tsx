"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsAndConditionsModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden border border-white/10 bg-[#0B1426] text-slate-200 shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-white/[0.03] border-b border-white/10">
          <DialogTitle className="text-2xl font-bold text-white">Terms of Service & License Agreement</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please review our software usage policies and legal agreements carefully.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-8 pr-4">
            {/* 1. Software License */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">1. Software License Agreement</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Kaero Prescribe grants you a non-exclusive, non-transferable, limited license to use the Software solely for your own internal clinical or hospital administrative purposes. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                <li>Reverse engineer, decompile, or disassemble the platform.</li>
                <li>Rent, lease, or sublicense access to third parties.</li>
                <li>Remove any proprietary notices or labels on the Software.</li>
              </ul>
            </section>

            {/* 2. Payments & Subscriptions */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">2. Payments & Subscriptions</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Subscriptions are billed on a recurring basis (Monthly or Yearly) as selected during setup. Subscription fees are exclusive of applicable GST, and GST will be charged additionally as per prevailing rates. Failure to maintain active payment may result in temporary suspension of service after a 3-day grace period. If auto-renewal fails after the grace period, your account will enter a read-only mode for 14 days before suspension. Prices are subject to change with a 30-day notice for existing active subscribers.
              </p>
            </section>

            {/* 3. Refund Policy */}
            <section className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2">3. Refund Policy</h4>
              <p className="text-sm text-amber-200/80 leading-relaxed italic mb-3">
                We maintain a strict tiered refund policy to ensure fair usage of our cloud resources. The refund window starts from the date of the first successful payment. Refunds are processed back to the original payment instrument within 7–10 business days:
              </p>
              <ul className="list-none space-y-2 text-sm text-amber-200/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <strong>0–7 Days:</strong> Eligible for a Full (100%) Refund.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <strong>7–17 Days:</strong> Eligible for an 80% Refund (20% retention fee applies).
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <strong>&gt; 17 Days:</strong> No refunds are permitted under any circumstances.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <strong>Add-ons:</strong> Modules added mid-subscription are non-refundable after their own 7-day window.
                </li>
              </ul>
            </section>

            {/* 4. SLA & Uptime */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">4. Service Level Agreement (SLA)</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kaero targets a <strong>99.9% uptime</strong> for all critical clinical modules. "Downtime" is defined as the platform being completely inaccessible, excluding periods of degraded performance. Planned maintenance is conducted during low-traffic windows (2 AM – 4 AM IST) with at least 48-hour prior notice via the Super-Admin dashboard. This SLA excludes downtime caused by third-party infrastructure (ISP/CDN outages) or Force Majeure. SLA credits (if any) are the sole remedy for uptime failures and do not constitute grounds for refund or termination. The SLA does not apply during the onboarding and setup period (first 48 hours post-activation).
              </p>
            </section>

            {/* 5. Data Privacy & DPDP Compliance */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">5. Data Privacy & DPDP Compliance</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                In accordance with the <strong>Digital Personal Data Protection Act (2023)</strong> and healthcare norms:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5a. Roles & Responsibilities</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Under the DPDP Act 2023, you act as the <strong>Data Fiduciary</strong>, and your patients act as <strong>Data Principals</strong>. Kaero acts solely as the <strong>Data Processor</strong>. You are solely responsible for obtaining valid, informed, purpose-limited consent from patients. Kaero processes patient data only on documented instructions from you.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5b. Data Principal Rights</h5>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">As the Data Fiduciary, you must accommodate the following rights of Data Principals:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                    <li><strong>Right to Access:</strong> Patients may request access to their data via the clinic (not directly via Kaero).</li>
                    <li><strong>Right to Correction:</strong> Patients may request correction of inaccurate data.</li>
                    <li><strong>Right to Erasure:</strong> Patients may request data deletion, subject to legal retention obligations.</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdrawal does not affect lawfulness of prior processing.</li>
                    <li><strong>Right to Nominate:</strong> Patients may nominate a representative in case of death or incapacity.</li>
                  </ul>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">
                    Kaero will assist technically within [DATA_REQUEST_SLA_DAYS] business days of a clinic's written request.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5c. Sensitive Personal Data</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Health/medical records, prescriptions, diagnoses, lab results, and biometric data are Sensitive Personal Data. Processing requires explicit consent. Kaero staff access is limited strictly to support purposes and requires audit-logged authorization.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5d. Data Retention</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Data is retained for the duration of the active subscription plus a 30-day grace window. Anonymized/aggregated analytics data may be retained indefinitely.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5e. Sub-Processors</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Kaero uses third-party infrastructure and service providers. We ensure sub-processors maintain equivalent or higher data protection standards. Clinics will be notified [SUBPROCESSOR_NOTICE_DAYS] days in advance of any material change.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5f. Security Measures</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                    <li>AES-256 encryption at rest, TLS 1.3 in transit.</li>
                    <li>Role-based access controls (RBAC) & Multi-factor authentication.</li>
                    <li>Regular vulnerability assessments ([CERTIFICATION_NAMES]).</li>
                    <li>Logical tenant isolation (no cross-tenant data access).</li>
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5g. Data Breach Notification</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Kaero will notify you without undue delay (and within 72 hours) of a confirmed personal data breach affecting your tenant data. You are responsible for assessing if DPDP Board/Data Principal notification is required. Kaero will take immediate steps to contain the breach and provide an incident report within [BREACH_REPORT_DAYS] days.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5h. Grievance Redressal</h5>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Grievance Officer: [GRIEVANCE_OFFICER_NAME] ([GRIEVANCE_OFFICER_EMAIL]). Complaints will be acknowledged within 48 hours and resolved within 30 days.
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded border border-white/10 mt-2">
                  <h5 className="text-xs font-bold text-slate-200 mb-1">5i. HIPAA Notice [PLACEHOLDER]</h5>
                  <p className="text-xs text-slate-400 italic">
                    Kaero Prescribe does not currently offer a Business Associate Agreement (BAA) for HIPAA-covered entities. Customers handling Protected Health Information (PHI) of US persons should not use this platform until a BAA is executed. [THIS SECTION TO BE COMPLETED BEFORE ENABLING HIPAA BADGE IN UI]
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Limitation of Liability */}
            <section className="p-4 bg-white/[0.04] rounded-xl border border-white/10">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">6. Limitation of Liability</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                Kaero provides tools for healthcare, not medical advice. Kaero shall not be liable for clinical outcomes or medical malpractice claims arising from your use of the platform.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                <li>You indemnify Kaero against claims arising from your failure to obtain valid patient consent or unauthorized use.</li>
                <li>Kaero's total aggregate liability shall not exceed the total fees paid by you in the 12 months preceding the claim.</li>
                <li>The liability cap does not apply to death/personal injury caused by gross negligence, fraud, or breaches of confidentiality.</li>
              </ul>
            </section>

            {/* 7. Termination & Portability */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">7. Termination & Data Portability</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Either party may terminate the agreement with a <strong>30-day notice</strong>.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Upon termination, we provide a 7-day window for you to export your patient records in standard JSON, CSV, and FHIR-compatible formats. After 30 days of inactivity following termination, all tenant data is securely purged. This purge is irreversible and Kaero bears no liability for data lost. On termination for cause, the export window may be reduced to 48 hours.
              </p>
            </section>

            {/* 8. Violation Policy */}
            <section>
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3">8. Violation & Forced Termination</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Except in cases of active security threats or illegal activity, Kaero will provide 7 days written notice and an opportunity to remedy the violation before forced termination. Use of the platform for unauthorized medical practices, illegal drug distribution tracking, or sharing of fraudulent medical reports will lead to immediate permanent termination without refund. Kaero reserves the right to report confirmed illegal activity to appropriate law enforcement authorities.
              </p>
            </section>

            {/* 9. Force Majeure */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">9. Force Majeure</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Neither party shall be liable for failures due to Force Majeure (natural disasters, acts of government, nationwide outages). Foreseeable infrastructure failure or third-party vendor SLA failures within Kaero's control do NOT qualify. The affected party must notify the other within 48 hours. Either party may terminate if it persists beyond 30 days.
              </p>
            </section>

            {/* 10. Governing Law & Dispute Resolution */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">10. Governing Law & Dispute Resolution</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                This Agreement shall be governed by the laws of India. Courts of [JURISDICTION_CITY], India shall have exclusive jurisdiction. Unresolved disputes after 30 days of good-faith resolution shall be referred to arbitration. All proceedings shall be conducted in English.
              </p>
            </section>

            {/* 11. Amendments to Terms */}
            <section>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">11. Amendments to Terms</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kaero reserves the right to amend these Terms with 30 days notice to active subscribers. Material changes require explicit re-acceptance via an in-app prompt. Clinics who do not accept material changes may terminate within the 30-day notice period without penalty.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 bg-white/[0.03] border-t border-white/10 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
