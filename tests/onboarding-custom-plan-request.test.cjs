const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

/**
 * CUSTOM PLAN — requirement intake.
 *
 * Follows the repo's existing onboarding test harness (node:test + on-the-fly TS transpile) rather
 * than introducing a second runner. No jsdom here: everything asserted is pure logic — what the
 * customer's answers serialize to, which staff-count fields are relevant, and the fact that a
 * request is never phrased as a plan.
 */

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._extensions[".ts"] = compileTypeScript;
Module._extensions[".tsx"] = compileTypeScript;
Module._resolveFilename = function resolveFrontendAlias(request, parent, isMain, options) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(projectRoot, request.slice(2))
    : request;
  return originalResolveFilename.call(this, resolvedRequest, parent, isMain, options);
};

function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
}

const {
  REQUIREMENT_CAPACITY_FIELDS,
  buildCustomPlanRequestPayload,
  buildRequirementSummary,
  hasRequirementContent,
  isCustomPlanSelection,
  pruneToRequestedModules,
  setRequestedLimit,
  toRequestedCount,
} = require("../components/onboarding/customPlanRequest.ts");

const { moduleReviewDestination } = require("../components/onboarding/reviewEditNavigation.ts");
const { SCREEN_ORDER, SCREEN_RAIL } = require("../components/onboarding/onboardingConfig.ts");

const PACKAGES = [
  { _id: "pkg-standard", slug: "clinic", isCustom: false },
  { _id: "pkg-custom", slug: "enterprise", isCustom: true },
];

// ── ROUTING: the step exists only on the custom path ─────────────────────────────
test("custom plan selection is detected from the catalog, not a local flag", () => {
  assert.equal(isCustomPlanSelection(PACKAGES, { selectionType: "package", packageId: "pkg-custom" }), true);
  assert.equal(isCustomPlanSelection(PACKAGES, { selectionType: "package", packageId: "pkg-standard" }), false);
  assert.equal(isCustomPlanSelection(PACKAGES, { selectionType: "individual", packageId: "pkg-custom" }), false);
  assert.equal(isCustomPlanSelection(undefined, { selectionType: "package", packageId: "pkg-custom" }), false);
});

test("a custom plan routes to the requirement step; standard paths are untouched", () => {
  assert.equal(moduleReviewDestination({}, false, true), "customPlan");
  // Standard flow keeps its existing destinations exactly.
  assert.equal(moduleReviewDestination({}, false, false), "review");
  assert.equal(moduleReviewDestination({}, false), "review");
  assert.equal(
    moduleReviewDestination({ ownerPractitionerIntent: undefined }, true, false),
    "practitioner",
  );
});

test("the requirement screen is registered without disturbing the existing order", () => {
  assert.ok(SCREEN_ORDER.includes("customPlan"));
  assert.equal(SCREEN_ORDER.indexOf("customPlan"), SCREEN_ORDER.indexOf("modules") + 1);
  assert.equal(SCREEN_ORDER.indexOf("review"), SCREEN_ORDER.indexOf("practitioner") + 1);
  // Shares the "Configure" rail with modules, so the progress bar gains no extra visible step.
  assert.equal(SCREEN_RAIL.customPlan, SCREEN_RAIL.modules);
});

// ── CONDITIONAL FIELDS ───────────────────────────────────────────────────────────
test("each staff count belongs to the module that justifies asking for it", () => {
  const byKey = Object.fromEntries(REQUIREMENT_CAPACITY_FIELDS.map((f) => [f.key, f.requiresModule]));
  assert.equal(byKey.doctors, "doctors");
  assert.equal(byKey.receptionists, "receptionist");
  assert.equal(byKey.pharmacists, "pharmacy");
  assert.equal(byKey.labTechs, "pathlab");
});

test("a count is only visible when its module is requested", () => {
  const visibleFor = (requested) =>
    REQUIREMENT_CAPACITY_FIELDS
      .filter((f) => f.requiresModule === null || requested.includes(f.requiresModule))
      .map((f) => f.key);

  assert.deepEqual(visibleFor(["doctors"]), ["doctors"]);
  assert.deepEqual(visibleFor(["pharmacy"]), ["pharmacists"]);
  assert.deepEqual(visibleFor(["pathlab"]), ["labTechs"]);
  assert.deepEqual(visibleFor(["receptionist"]), ["receptionists"]);
  assert.deepEqual(visibleFor([]), []);
  assert.deepEqual(visibleFor(["doctors", "pharmacy"]), ["doctors", "pharmacists"]);
});

test("de-selecting a module drops the count that was typed for it", () => {
  const pruned = pruneToRequestedModules({
    requestedModules: ["doctors"],
    requestedLimits: { doctors: 25, pharmacists: 5, branches: 3 },
  });
  assert.deepEqual(pruned.requestedLimits, { doctors: 25, branches: 3 }); // branches is org-level
});

// ── VALIDATION ───────────────────────────────────────────────────────────────────
test("counts are parsed leniently — a bad entry becomes 'not stated', never an error", () => {
  assert.equal(toRequestedCount("25"), 25);
  assert.equal(toRequestedCount(25.9), 25);
  assert.equal(toRequestedCount("0"), 0);
  assert.equal(toRequestedCount("-5"), undefined);
  assert.equal(toRequestedCount("abc"), undefined);
  assert.equal(toRequestedCount(""), undefined);
  assert.equal(toRequestedCount(undefined), undefined);
});

test("clearing a field removes the key rather than storing a zero", () => {
  assert.deepEqual(setRequestedLimit({ doctors: 25 }, "doctors", ""), {});
  assert.deepEqual(setRequestedLimit({ doctors: 25 }, "doctors", "-1"), {});
  assert.deepEqual(setRequestedLimit({}, "doctors", "30"), { doctors: 30 });
  // Zero is a real answer and must survive.
  assert.deepEqual(setRequestedLimit({}, "pharmacists", "0"), { pharmacists: 0 });
});

// ── PAYLOAD ──────────────────────────────────────────────────────────────────────
test("nothing is sent when the customer stated nothing", () => {
  assert.equal(hasRequirementContent(undefined), false);
  assert.equal(buildCustomPlanRequestPayload(undefined), undefined);
  assert.equal(buildCustomPlanRequestPayload({}), undefined);
  assert.equal(buildCustomPlanRequestPayload({ requestedModules: [], requestedLimits: {} }), undefined);
  assert.equal(buildCustomPlanRequestPayload({ customerRequirementNote: "   " }), undefined);
});

test("the payload carries only request-shaped keys — never contract vocabulary", () => {
  const payload = buildCustomPlanRequestPayload({
    requestedModules: ["pharmacy", "doctors"],
    requestedLimits: { doctors: 25, pharmacists: 5, branches: 3 },
    multiBranchRequested: true,
    preferredBillingCycle: "yearly",
    customerRequirementNote: "  We run 3 clinics.  ",
  });

  assert.deepEqual(payload.requestedModules, ["doctors", "pharmacy"]);
  assert.deepEqual(payload.requestedLimits, { doctors: 25, pharmacists: 5, branches: 3 });
  assert.equal(payload.customerRequirementNote, "We run 3 clinics.");

  // The contract vocabulary (maxDoctors / limits / entitlements) must not appear anywhere.
  const serialized = JSON.stringify(payload).toLowerCase();
  for (const forbidden of ["maxdoctors", "maxbranches", "maxadmins", "entitlement", "quota", '"limits"']) {
    assert.equal(serialized.includes(forbidden), false, `payload must not contain ${forbidden}`);
  }
});

test("a count for an unselected module never reaches the server", () => {
  const payload = buildCustomPlanRequestPayload({
    requestedModules: ["doctors"],
    requestedLimits: { doctors: 25, pharmacists: 5 },
  });
  assert.deepEqual(payload.requestedLimits, { doctors: 25 });
});

test("an unsupported billing preference is dropped rather than invented", () => {
  const payload = buildCustomPlanRequestPayload({
    requestedLimits: { doctors: 1 },
    preferredBillingCycle: "quarterly",
  });
  assert.equal(payload.preferredBillingCycle, undefined);
});

// ── CUSTOMER REVIEW ──────────────────────────────────────────────────────────────
test("review is derived from the payload, so it shows exactly what is sent", () => {
  const request = {
    requestedModules: ["doctors", "pharmacy"],
    requestedLimits: { branches: 3, doctors: 25, pharmacists: 5 },
    preferredBillingCycle: "yearly",
    customerRequirementNote: "Need multi-location access.",
  };
  const summary = buildRequirementSummary(request, { doctors: "Doctors", pharmacy: "Pharmacy" });

  assert.deepEqual(summary.modules, ["Doctors", "Pharmacy"]);
  assert.deepEqual(summary.setup, ["3 branches", "25 doctors", "5 pharmacists"]);
  assert.equal(summary.billing, "Yearly");
  assert.equal(summary.note, "Need multi-location access.");

  // Every figure shown is present in the payload with the same value.
  const payload = buildCustomPlanRequestPayload(request);
  assert.equal(summary.setup.includes(`${payload.requestedLimits.doctors} doctors`), true);
});

test("a single branch reads naturally", () => {
  assert.deepEqual(buildRequirementSummary({ requestedLimits: { branches: 1 } }).setup, ["1 branch"]);
});

test("review renders nothing at all for a non-custom session", () => {
  assert.equal(buildRequirementSummary(undefined), null);
  assert.equal(buildRequirementSummary({}), null);
});

// ── LANGUAGE ─────────────────────────────────────────────────────────────────────
test("the customer-facing screen talks about requirements, never entitlements", () => {
  const step = fs.readFileSync(
    path.join(projectRoot, "components/onboarding/steps/CustomPlanRequirements.tsx"),
    "utf8",
  );
  // Only the rendered copy matters — comments legitimately discuss the internal model.
  // JSX copy wraps across source lines, so collapse whitespace before matching phrases.
  const copy = step
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
  for (const admin of ["entitlement", "quota", "snapshot", "contract version", "access state", "unlimited"]) {
    assert.equal(copy.includes(admin), false, `customer copy must not say "${admin}"`);
  }
  assert.equal(copy.includes("tell us what you need"), true);
  assert.equal(copy.includes("final pricing and limits may differ"), true);
});

test("the review card is titled as requirements, not as a plan or entitlements", () => {
  const review = fs.readFileSync(
    path.join(projectRoot, "components/onboarding/steps/ReviewStep.tsx"),
    "utf8",
  );
  assert.equal(review.includes("Your requirements"), true);
  assert.equal(review.includes("Your entitlements"), false);
  assert.equal(review.includes("Your plan limits"), false);
});
