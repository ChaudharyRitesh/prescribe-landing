import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const stepsUrl = new URL("components/onboarding/steps/", root);
const stepFiles = (await readdir(stepsUrl)).filter((file) => file.endsWith(".tsx"));
const onboardingStepSources = (await Promise.all(
  stepFiles.map((file) => readFile(new URL(file, stepsUrl), "utf8")),
)).join("\n");

for (const unsafeServerRender of [
  /statusResp\?\.failureReason\s*\|\|/,
  /\(error as Error\)\.message/,
  /e\?\.response\?\.data\?\.message/,
  /e\?\.message\s*\|\|/,
  /err\?\.response\?\.data\?\.message/,
  /err\.message\s*\|\|/,
  /alert\(res\.message\)/,
]) {
  assert.doesNotMatch(
    onboardingStepSources,
    unsafeServerRender,
    `Unsafe server error render returned: ${unsafeServerRender}`,
  );
}

const safeMessagesSource = await readFile(new URL("components/onboarding/safeErrorMessages.ts", root), "utf8");
assert.match(
  safeMessagesSource,
  /We couldn't finish setting up your workspace\. Please try again, or go back and review your setup\./,
  "Provisioning fallback must remain approved copy",
);
assert.doesNotMatch(
  onboardingStepSources + safeMessagesSource,
  /E11000|SUBDOMAIN_TAKEN/,
  "Frontend must not infer database failures or subdomain conflicts",
);

const moduleSelectionSource = await readFile(
  new URL("components/onboarding/steps/ModuleCatalogSelection.tsx", root),
  "utf8",
);
assert.match(
  moduleSelectionSource,
  /data\.selectionType !== undefined/,
  "Solo-Doctor default must distinguish configured selection from uninitialized selection",
);
assert.doesNotMatch(
  moduleSelectionSource,
  /data\.selectedModules !== undefined/,
  "Hydrated empty modules must remain eligible for the uninitialized solo-Doctor default",
);
assert.match(
  moduleSelectionSource,
  /isDoctorProfessionalPractice\(orgTypes, data\.facilityType\)/,
  "Solo-Doctor default must use the canonical organization predicate",
);
assert.match(
  moduleSelectionSource,
  /const doctorsModule = moduleBySlug\.doctors;/,
  "Solo-Doctor default must resolve the canonical Doctors module from the live catalog",
);
assert.match(
  moduleSelectionSource,
  /individualModuleSelectionPatch\(defaultModules\)/,
  "Solo-Doctor default must persist an atomic individual selection",
);
assert.match(
  moduleSelectionSource,
  /individualModuleSelectionPatch\(nextModules\)/,
  "Explicit module choices must persist an atomic individual selection",
);
assert.match(
  moduleSelectionSource,
  /selectedModules\.reduce\(\(sum, slug\) => sum \+ priceOf\(moduleBySlug\[slug\]\), 0\)/,
  "Selected-module pricing must continue to derive from the live catalog",
);
assert.doesNotMatch(
  moduleSelectionSource,
  /1,?999|ObjectId/,
  "Solo-Doctor default must not hardcode catalog price or database identifiers",
);

const reviewSource = await readFile(new URL("components/onboarding/steps/ReviewStep.tsx", root), "utf8");
assert.match(
  reviewSource,
  /showSoloDoctorControl = doctorEntitled && isDoctorProfessionalPractice/,
  "Review switch must remain driven by canonical Doctor entitlement and the solo-Doctor predicate",
);
assert.match(
  reviewSource,
  /aria-label="Practicing as a Doctor"/,
  "Existing Review practitioner switch must remain present",
);

const canonicalStateSource = await readFile(
  new URL("components/onboarding/reviewEditNavigation.ts", root),
  "utf8",
);
assert.match(
  canonicalStateSource,
  /selectedModules\?\.includes\('doctors'\)/,
  "Individual Doctor entitlement must derive from selectedModules",
);
assert.match(
  canonicalStateSource,
  /selectedPackage\.modules\?\.includes\('doctors'\)/,
  "Package Doctor entitlement must derive from the selected package catalog entry",
);

console.log("Onboarding safety + solo-Doctor module default self-check: PASS");
