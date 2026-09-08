/**
 * CUSTOM PLAN REQUIREMENT INTAKE — the customer-side shape and its helpers.
 *
 * These values are a REQUEST, never a contract. The naming is deliberate: `requested*` / `preferred*`
 * so nothing downstream can mistake this bag for entitlement. The backend keeps it on
 * OnboardingRequest.customPlanRequest as provenance, and only an approved Super Admin quote ever
 * resolves into an actual entitlement snapshot.
 *
 * Kept as a standalone module (rather than inside the step component) so the wizard, the review
 * screen and the register payload all read one definition, and so the pure parts are testable.
 */

export type PreferredBillingCycle = "monthly" | "yearly";

export interface RequestedLimits {
  branches?: number;
  doctors?: number;
  receptionists?: number;
  pharmacists?: number;
  labTechs?: number;
  admins?: number;
}

export interface CustomPlanRequest {
  requestedModules?: string[];
  requestedLimits?: RequestedLimits;
  multiBranchRequested?: boolean;
  preferredBillingCycle?: PreferredBillingCycle;
  customerRequirementNote?: string;
}

export type RequestedLimitKey = keyof RequestedLimits;

/**
 * Staff-count fields and the module each one belongs to. A count is only asked for when its module
 * is actually requested — nobody should be asked how many pharmacists they need without Pharmacy.
 * `requiresModule: null` means organization-level (always relevant).
 *
 * Slugs match the real ModuleCatalog; `admins` is deliberately absent from the customer form —
 * sub-admin seats are an internal commercial dimension, not something a customer thinks in.
 */
export const REQUIREMENT_CAPACITY_FIELDS: {
  key: RequestedLimitKey;
  label: string;
  placeholder: string;
  requiresModule: string | null;
}[] = [
  { key: "doctors", label: "Doctors", placeholder: "e.g. 25", requiresModule: "doctors" },
  { key: "receptionists", label: "Receptionists", placeholder: "e.g. 10", requiresModule: "receptionist" },
  { key: "pharmacists", label: "Pharmacists", placeholder: "e.g. 5", requiresModule: "pharmacy" },
  { key: "labTechs", label: "Lab technicians", placeholder: "e.g. 6", requiresModule: "pathlab" },
];

/**
 * Parse one requested count. Lightweight on purpose — this is requirement intake, not contract
 * enforcement, so an unusable entry simply becomes "not stated" rather than blocking the customer.
 */
export const toRequestedCount = (raw: string | number | null | undefined): number | undefined => {
  if (raw === null || raw === undefined) return undefined;
  const str = String(raw).trim();
  if (str === "") return undefined;
  const n = Number(str);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.floor(n);
};

/** Immutably set (or clear) one requested count. Clearing removes the key so it stays truly unstated. */
export const setRequestedLimit = (
  limits: RequestedLimits,
  key: RequestedLimitKey,
  raw: string | number | null | undefined,
): RequestedLimits => {
  const value = toRequestedCount(raw);
  const next = { ...limits };
  if (value === undefined) delete next[key];
  else next[key] = value;
  return next;
};

/**
 * Drop staff counts whose module is no longer requested, so a customer who selects Pharmacy, types a
 * pharmacist count, then removes Pharmacy does not silently send a figure for something they did not
 * ask for. Run when building the payload — the form itself keeps the value while the user edits.
 */
export const pruneToRequestedModules = (request: CustomPlanRequest): CustomPlanRequest => {
  const selected = new Set(request.requestedModules ?? []);
  const limits = { ...(request.requestedLimits ?? {}) };
  for (const field of REQUIREMENT_CAPACITY_FIELDS) {
    if (field.requiresModule && !selected.has(field.requiresModule)) delete limits[field.key];
  }
  return { ...request, requestedLimits: limits };
};

/** True when the customer actually told us something worth sending. */
export const hasRequirementContent = (request: CustomPlanRequest | undefined): boolean => {
  if (!request) return false;
  const limits = request.requestedLimits ?? {};
  return (
    (request.requestedModules?.length ?? 0) > 0 ||
    Object.keys(limits).length > 0 ||
    typeof request.multiBranchRequested === "boolean" ||
    !!request.preferredBillingCycle ||
    !!request.customerRequirementNote?.trim()
  );
};

/**
 * The object sent with /onboarding/register. Returns undefined when nothing was stated, so the
 * backend stores a genuinely absent field rather than an empty record.
 */
export const buildCustomPlanRequestPayload = (
  request: CustomPlanRequest | undefined,
): CustomPlanRequest | undefined => {
  if (!hasRequirementContent(request)) return undefined;
  const pruned = pruneToRequestedModules(request as CustomPlanRequest);
  const note = pruned.customerRequirementNote?.trim();
  return {
    ...(pruned.requestedModules?.length ? { requestedModules: [...pruned.requestedModules].sort() } : {}),
    ...(Object.keys(pruned.requestedLimits ?? {}).length ? { requestedLimits: pruned.requestedLimits } : {}),
    ...(typeof pruned.multiBranchRequested === "boolean" ? { multiBranchRequested: pruned.multiBranchRequested } : {}),
    // Whitelisted, not merely truthy: an unsupported cycle must never reach the payload OR the
    // customer's review screen. Mirrors the backend enum rather than trusting the form.
    ...(pruned.preferredBillingCycle === "monthly" || pruned.preferredBillingCycle === "yearly"
      ? { preferredBillingCycle: pruned.preferredBillingCycle }
      : {}),
    ...(note ? { customerRequirementNote: note } : {}),
  };
};

/** Customer-facing review rows. Labelled as REQUIREMENTS — never as limits, plan or contract. */
export const buildRequirementSummary = (
  request: CustomPlanRequest | undefined,
  moduleLabels: Record<string, string> = {},
): { modules: string[]; setup: string[]; billing?: string; note?: string } | null => {
  const payload = buildCustomPlanRequestPayload(request);
  if (!payload) return null;

  const limits = payload.requestedLimits ?? {};
  const setup: string[] = [];
  if (limits.branches !== undefined) {
    setup.push(`${limits.branches} ${limits.branches === 1 ? "branch" : "branches"}`);
  }
  for (const field of REQUIREMENT_CAPACITY_FIELDS) {
    const value = limits[field.key];
    if (value !== undefined) setup.push(`${value} ${field.label.toLowerCase()}`);
  }

  return {
    modules: (payload.requestedModules ?? []).map((slug) => moduleLabels[slug] ?? slug),
    setup,
    billing: payload.preferredBillingCycle
      ? payload.preferredBillingCycle === "yearly" ? "Yearly" : "Monthly"
      : undefined,
    note: payload.customerRequirementNote,
  };
};

/**
 * Is this session on the custom-plan path? True only for a catalog package flagged `isCustom` — the
 * same signal registerOrg uses to route the session to `quote_pending` instead of pricing it. Derived
 * from the live catalog rather than a local flag so the wizard and the backend cannot disagree.
 */
export const isCustomPlanSelection = (
  packages: { _id?: string; isCustom?: boolean }[] | undefined,
  data: { selectionType?: string; packageId?: string },
): boolean => {
  if (data.selectionType !== "package" || !data.packageId) return false;
  return packages?.find((p) => p._id === data.packageId)?.isCustom === true;
};
