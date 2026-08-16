import { CatalogResponse } from "@/lib/api/types/onboarding.types";
import { OnboardingData } from "./OnboardingWizard";

export interface OnboardingPricing {
  isCustom: boolean;
  subtotal: number;
  referralDiscount: number;
  gst: number;
  total: number;
  cycle: "monthly" | "yearly";
}

// Display-only pricing that mirrors the mock's order summary. The backend
// re-resolves the authoritative amount server-side at register time.
export function computePricing(data: OnboardingData, catalog?: CatalogResponse): OnboardingPricing {
  const cycle = data.billingCycle === "yearly" ? "yearly" : "monthly";
  const modules = catalog?.modules || [];
  const packages = catalog?.packages || [];
  const priceOf = (slug: string) => {
    const m = modules.find((x) => x.slug === slug);
    return m ? (cycle === "yearly" ? m.pricing?.yearly || 0 : m.pricing?.monthly || 0) : 0;
  };

  let subtotal = 0;
  let isCustom = false;

  if (data.selectionType === "package" && data.packageId) {
    const p = packages.find((x) => x._id === data.packageId);
    if (p?.isCustom) isCustom = true;
    else subtotal = p ? (cycle === "yearly" ? p.pricing?.yearly || 0 : p.pricing?.monthly || 0) : 0;
  } else {
    subtotal = (data.selectedModules || []).reduce((s, slug) => s + priceOf(slug), 0);
  }

  if (data.subscriptionPlan === "custom") isCustom = true;
  // An approved custom quote resumes with a concrete price.
  if (data.quotedPrice && data.quotedPrice > 0) {
    subtotal = data.quotedPrice;
    isCustom = false;
  }

  const referralDiscount = !isCustom && data.referralCode ? Math.round(subtotal * 0.05) : 0;
  const taxable = subtotal - referralDiscount;
  const gst = isCustom ? 0 : Math.round(taxable * 0.18);
  const total = taxable + gst;

  return { isCustom, subtotal, referralDiscount, gst, total, cycle };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
