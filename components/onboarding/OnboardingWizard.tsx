"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Mail,
  ShieldCheck,
  FileText,
  LayoutGrid,
  CreditCard,
  Rocket,
  Check,
  Lock,
  LifeBuoy,
} from "lucide-react";
import { FacilityTypeSelection } from "./steps/FacilityTypeSelection";
import { EmailInitiation } from "./steps/EmailInitiation";
import { OtpVerification } from "./steps/OtpVerification";
import { OrganizationDetails } from "./steps/OrganizationDetails";
import { ModuleCatalogSelection } from "./steps/ModuleCatalogSelection";
import { FinalReviewAndPayment } from "./steps/FinalReviewAndPayment";
import { ProvisioningStatus } from "./steps/ProvisioningStatus";

export type OnboardingData = {
  sessionId?: string;
  verifiedToken?: string;
  email?: string;
  subdomain?: string;
  orgName?: string;
  contactName?: string;
  contactPhone?: string;
  referralCode?: string;
  gstNumber?: string;
  facilityType?: string;
  selectionType?: 'package' | 'individual';
  packageId?: string;
  selectedModules?: string[];
  billingCycle?: 'monthly' | 'yearly';
  subscriptionPlan?: string;
  status?: string;
  quotedPrice?: number;
  customLimits?: {
    maxDoctors?: number;
    maxReceptionists?: number;
    maxLabTechs?: number;
    maxPharmacists?: number;
    maxAdmins?: number;
    maxStorageGB?: number;
  };
  address?: {
    building?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
};

const steps = [
  { label: "Facility Type", caption: "Pick your facility", icon: Building2 },
  { label: "Email Entry", caption: "Enter work email", icon: Mail },
  { label: "Verification", caption: "Confirm the code", icon: ShieldCheck },
  { label: "Organization", caption: "Workspace identity", icon: FileText },
  { label: "Modules & Services", caption: "Choose your tools", icon: LayoutGrid },
  { label: "Review & Payment", caption: "Billing details", icon: CreditCard },
  { label: "Complete", caption: "Launch workspace", icon: Rocket },
];

interface OnboardingWizardProps {
  externalData?: OnboardingData;
  externalUpdateData?: (newData: Partial<OnboardingData>) => void;
}

export function OnboardingWizard({ externalData, externalUpdateData }: OnboardingWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const prefersReduced = useReducedMotion();

  // Use external data if provided, otherwise fallback to local (though page should provide it)
  const [localData, setLocalData] = useState<OnboardingData>({});

  const data = externalData || localData;
  const updateData = externalUpdateData || ((newData: Partial<OnboardingData>) => setLocalData(prev => ({ ...prev, ...newData })));

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Automatically fast-forward to payment step if session is pending payment
  useEffect(() => {
    if (data.sessionId && (data.status === 'pending_payment' || data.status === 'provisioned' || data.status === 'provisioning')) {
      if (data.status === 'provisioned' || data.status === 'provisioning') {
        setActiveStep(6);
      } else {
        setActiveStep(5);
      }
    }
  }, [data.sessionId, data.status]);

  // Render the appropriate step component
  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <FacilityTypeSelection onNext={nextStep} updateData={updateData} data={data} />;
      case 1:
        return <EmailInitiation onNext={nextStep} updateData={updateData} data={data} />;
      case 2:
        return <OtpVerification onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 3:
        return <OrganizationDetails onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 4:
        return <ModuleCatalogSelection onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 5:
        return <FinalReviewAndPayment onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 6:
        return <ProvisioningStatus data={data} />;
      default:
        return <p className="text-slate-400">Unknown step</p>;
    }
  };

  const pct = Math.round((activeStep / (steps.length - 1)) * 100);
  const current = steps[activeStep];

  return (
    <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-[clamp(280px,26%,340px)_1fr]">
      {/* ── Desktop step rail ─────────────────────────────────────────── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-white/[0.02] p-8 lg:flex">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -left-16 top-1/3 h-64 w-64 rounded-full bg-teal-500/10 blur-[90px]" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
            Setup Progress
          </div>
          <div className="mb-7 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-white">{pct}%</span>
            <span className="text-sm text-slate-400">complete</span>
          </div>

          {/* vertical step list */}
          <ol className="space-y-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const state = i < activeStep ? "done" : i === activeStep ? "active" : "todo";
              const isLast = i === steps.length - 1;
              return (
                <li key={s.label} className="flex gap-4">
                  {/* node + connector */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                        state === "active"
                          ? "border-transparent bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_0_22px_-4px_rgba(45,212,191,0.7)]"
                          : state === "done"
                          ? "border-teal-400/40 bg-teal-400/15 text-teal-300"
                          : "border-white/10 bg-white/[0.04] text-slate-500"
                      }`}
                    >
                      {state === "done" ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <Icon size={16} />
                      )}
                      {state === "active" && (
                        <span className="absolute inset-0 rounded-xl ring-2 ring-teal-400/30" />
                      )}
                    </span>
                    {!isLast && (
                      <span
                        className={`my-1 w-px flex-1 transition-colors duration-300 ${
                          i < activeStep ? "bg-teal-400/50" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>

                  {/* label */}
                  <div className={`pb-7 pt-1 ${isLast ? "pb-0" : ""}`}>
                    <p
                      className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
                        state === "active"
                          ? "text-white"
                          : state === "done"
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{s.caption}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* trust footer */}
        <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Lock size={13} className="text-teal-400" />
            256-bit encrypted &middot; HIPAA &amp; DPDP aligned
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <LifeBuoy size={13} className="text-slate-400" />
            Need help? support@kaerogroup.com
          </p>
        </div>
      </aside>

      {/* ── Mobile compact progress ───────────────────────────────────── */}
      <div className="border-b border-white/10 bg-white/[0.02] p-5 lg:hidden">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400">
          <span>
            Step {activeStep + 1} of {steps.length}
          </span>
          <span className="font-semibold text-teal-300">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-3 flex items-center gap-2 font-heading text-base font-bold text-white">
          <current.icon size={16} className="text-teal-300" />
          {current.label}
        </p>
      </div>

      {/* ── Step content ──────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="mx-auto w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: prefersReduced ? 0.15 : 0.32, ease: "easeOut" }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
