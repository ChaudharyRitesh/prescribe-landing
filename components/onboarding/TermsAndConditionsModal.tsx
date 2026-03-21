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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2 bg-slate-50 border-b border-slate-100">
          <DialogTitle className="text-2xl font-bold text-slate-900">Terms of Service & License Agreement</DialogTitle>
          <DialogDescription className="text-slate-500">
            Please review our software usage policies and legal agreements carefully.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-8 pr-4">
            {/* 1. Software License */}
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">1. Software License Agreement</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Kaero Prescribe grants you a non-exclusive, non-transferable, limited license to use the Software solely for your own internal clinical or hospital administrative purposes. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>Reverse engineer, decompile, or disassemble the platform.</li>
                <li>Rent, lease, or sublicense access to third parties.</li>
                <li>Remove any proprietary notices or labels on the Software.</li>
              </ul>
            </section>

            {/* 2. Payments & Subscriptions */}
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">2. Payments & Subscriptions</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subscriptions are billed on a recurring basis (Monthly or Yearly) as selected during setup. 
                Failure to maintain active payment may result in temporary suspension of service after a 3-day grace period. 
                Prices are subject to change with a 30-day notice for existing active subscribers.
              </p>
            </section>

            {/* 3. Refund Policy */}
            <section className="p-4 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
              <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">3. Refund Policy</h4>
              <p className="text-sm text-amber-900/80 leading-relaxed italic mb-3">
                We maintain a strict tiered refund policy to ensure fair usage of our cloud resources:
              </p>
              <ul className="list-none space-y-2 text-sm text-amber-900/80">
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
              </ul>
            </section>

            {/* 4. SLA & Uptime */}
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">4. Service Level Agreement (SLA)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kaero targets a <strong>99.9% uptime</strong> for all critical clinical modules. Planned maintenance is conducted during low-traffic windows (2 AM – 4 AM IST) with at least 48-hour prior notice via the Super-Admin dashboard. This SLA excludes downtime caused by third-party infrastructure (ISP/CDN outages) or Force Majeure.
              </p>
            </section>

            {/* 5. Data Compliance (DPDP Act 2023) */}
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">5. Data Privacy & DPDP Compliance</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                In accordance with the <strong>Digital Personal Data Protection Act (2023)</strong> and healthcare norms:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Data Ownership:</strong> You (the Fiduciary) retain exclusive ownership of all patient records. Kaero (the Processor) acts solely on your instructions.</li>
                <li><strong>Storage:</strong> All medical data is stored within secured Indian Data Centers to ensure data residency compliance.</li>
                <li><strong>Security:</strong> AES-256 encryption at rest and TLS 1.3 in transit.</li>
              </ul>
            </section>

            {/* 6. Limitation of Liability */}
            <section className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">6. Limitation of Liability</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Kaero provides tools for healthcare, not medical advice. Kaero shall not be liable for:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>Clinical outcomes or medical malpractice claims arising from your use of the platform.</li>
                <li>Loss of profits or indirect damages exceeding the total fees paid by you in the 6 months preceding the claim.</li>
              </ul>
            </section>

            {/* 7. Termination & Portability */}
            <section>
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">7. Termination & Data Portability</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Either party may terminate the agreement with a <strong>30-day notice</strong>.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upon termination, we provide a 7-day window for you to export your patient records in standard JSON/CSV formats. After 30 days of inactivity following termination, all tenant data is securely purged from our active databases.
              </p>
            </section>

            {/* 8. Violation Policy */}
            <section>
              <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">8. Violation & Forced Termination</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use of the platform for unauthorized medical practices, illegal drug distribution tracking, or sharing of fraudulent medical reports will lead to immediate permanent termination without refund. High-frequency automated attacks or scraping attempts will result in an IP-level block.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
