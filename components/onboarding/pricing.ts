import { useMemo } from "react";
import { usePricePreviewQuery } from "@/hooks/queries/useOnboarding";
import { PricePreviewPayload } from "@/lib/api/types/onboarding.types";
import { OnboardingData } from "./OnboardingWizard";

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Builds the price-preview request body from the current selection. Null when there's
 *  nothing to price yet (selection incomplete). */
export function toPricePreviewPayload(data: OnboardingData): PricePreviewPayload | null {
  if (!data.selectionType) return null;
  if (data.selectionType === "package" && !data.packageId) return null;
  if (data.selectionType === "individual" && !(data.selectedModules?.length)) return null;
  return {
    organizationType: data.facilityType,
    selectionType: data.selectionType,
    packageId: data.packageId,
    selectedModules: data.selectedModules,
    billingCycle: data.billingCycle || "monthly",
  };
}

export interface OrderMoney {
  subtotal: number;
  gst: number;
  gstRate: number;
  total: number;
}

export interface OrderPricing {
  isCustom: boolean;
  money: OrderMoney | null;
  isLoading: boolean;
  isError: boolean;
  cycle: "monthly" | "yearly";
}

/**
 * Single server-authoritative pricing source shared by Review and Payment.
 *
 * Prefers an already-registered session's stored `pricingSnapshot` (resume flow — the
 * amount was already resolved server-side at a prior register() call, or set by staff for
 * an approved custom quote). Otherwise calls the non-mutating price-preview endpoint for
 * the live selection. Never computes GST or the final payable amount on the client.
 */
export function useOrderPricing(data: OnboardingData): OrderPricing {
  const cycle = data.billingCycle === "yearly" ? "yearly" : "monthly";
  const hasSnapshot = !!data.pricingSnapshot;
  const payload = hasSnapshot ? null : toPricePreviewPayload(data);
  const { data: previewRes, isLoading, isError } = usePricePreviewQuery(payload);
  const preview = previewRes?.data;

  return useMemo(() => {
    if (hasSnapshot) {
      const s = data.pricingSnapshot!;
      return { isCustom: false, money: { subtotal: s.subtotal, gst: s.gst, gstRate: s.gstRate, total: s.total }, isLoading: false, isError: false, cycle };
    }
    if (preview?.isCustom) {
      return { isCustom: true, money: null, isLoading: false, isError: false, cycle };
    }
    if (preview && preview.subtotal != null && preview.total != null) {
      return {
        isCustom: false,
        money: { subtotal: preview.subtotal, gst: preview.gst ?? 0, gstRate: preview.gstRate ?? 0.18, total: preview.total },
        isLoading: false,
        isError: false,
        cycle,
      };
    }
    return { isCustom: false, money: null, isLoading, isError, cycle };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSnapshot, data.pricingSnapshot, preview, isLoading, isError, cycle]);
}

/** Compact header name per the mock's "render intelligently" rule: never lists every
 *  module once the selection grows past two. */
export function selectionHeaderName(labels: { label: string }[]): string {
  if (labels.length === 0) return "—";
  if (labels.length === 1) return labels[0].label;
  if (labels.length === 2) return `${labels[0].label} + ${labels[1].label}`;
  return `${labels[0].label}, ${labels[1].label} +${labels.length - 2} more`;
}

export function moduleCountLabel(count: number, isPackage: boolean): string {
  if (isPackage) return `${count} module${count === 1 ? "" : "s"} included`;
  return `${count} module${count === 1 ? "" : "s"}`;
}
