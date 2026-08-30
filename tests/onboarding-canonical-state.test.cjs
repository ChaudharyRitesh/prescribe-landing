const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { JSDOM } = require("jsdom");

const projectRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;
const originalLoad = Module._load;

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

const catalog = {
  modules: [
    {
      _id: "doctor-module",
      slug: "doctors",
      label: "Doctor Module",
      category: "Clinical",
      pricing: { monthly: 3147, yearly: 31470 },
      recommendedFor: ["doctor"],
      isActive: true,
      order: 1,
    },
    {
      _id: "pharmacy-module",
      slug: "pharmacy",
      label: "Pharmacy Module",
      category: "Operations",
      pricing: { monthly: 2273, yearly: 22730 },
      isActive: true,
      order: 2,
    },
  ],
  packages: [
    {
      _id: "clinical-package",
      slug: "clinical-package",
      label: "Clinical Package",
      modules: ["doctors"],
      pricing: { monthly: 5000, yearly: 50000 },
      isActive: true,
      order: 1,
    },
  ],
};

const orgTypes = [{
  _id: "doctor-org",
  slug: "doctor",
  label: "Doctor / Professional Practice",
  multiBranchEligible: false,
  isActive: true,
  order: 1,
  subTypes: [{ id: "general-medicine", label: "General Medicine" }],
}];

let capturedRegister;
const onboardingHooks = {
  useCatalogQuery: () => ({ data: catalog, isLoading: false, error: null }),
  useOrgTypesQuery: () => ({ data: { data: orgTypes }, isLoading: false }),
  usePricePreviewQuery: (payload) => ({
    data: payload ? { data: { subtotal: 3147, gst: 566.46, gstRate: 0.18, total: 3713.46 } } : undefined,
    isLoading: false,
    isError: false,
  }),
  useRegisterOrgMutation: () => ({
    mutate: (request) => { capturedRegister = request; },
    isPending: false,
  }),
};

Module._load = function loadWithFrontendMocks(request, parent, isMain) {
  if (request === "@/hooks/queries/useOnboarding") return onboardingHooks;
  return originalLoad.call(this, request, parent, isMain);
};

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.IS_REACT_ACT_ENVIRONMENT = true;

const React = require("react");
const { act } = React;
const { createRoot } = require("react-dom/client");
const { ModuleCatalogSelection } = require("../components/onboarding/steps/ModuleCatalogSelection.tsx");
const { ReviewStep } = require("../components/onboarding/steps/ReviewStep.tsx");
const { PaymentStep } = require("../components/onboarding/steps/PaymentStep.tsx");
const { OnboardingWizard } = require("../components/onboarding/OnboardingWizard.tsx");
const {
  effectiveDoctorsSelected,
  normalizeDoctorsSelected,
} = require("../components/onboarding/reviewEditNavigation.ts");

async function mount(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(element); });
  return {
    container,
    root,
    async render(next) { await act(async () => { root.render(next); }); },
    async unmount() {
      await act(async () => { root.unmount(); });
      container.remove();
    },
  };
}

function moduleElement(data, updates) {
  return React.createElement(ModuleCatalogSelection, {
    data,
    updateData: (patch) => updates.push(patch),
    onNext: () => {},
    onBack: () => {},
  });
}

function reviewElement(data, updates = []) {
  return React.createElement(ReviewStep, {
    data,
    updateData: (patch) => updates.push(patch),
    onNext: () => {},
    onBack: () => {},
    onEdit: () => {},
  });
}

test("fresh solo Doctor defaults from the live catalog and explicit OFF remains OFF", async () => {
  const updates = [];
  const fresh = {
    facilityType: "doctor",
    specialization: "general-medicine",
    contactName: "Dr Test",
  };
  const view = await mount(moduleElement(fresh, updates));

  const doctorToggle = view.container.querySelector('input[aria-label="Doctor Module"]');
  assert.equal(doctorToggle.checked, true);
  assert.match(view.container.textContent, /₹3,147\s*\/ month/);
  assert.deepEqual(updates.at(-1), {
    selectionType: "individual",
    packageId: undefined,
    selectedModules: ["doctors"],
    doctorsSelected: true,
    subscriptionPlan: "individual",
  });

  const defaulted = { ...fresh, ...updates.at(-1) };
  await view.render(moduleElement(defaulted, updates));
  await act(async () => { doctorToggle.click(); });
  const explicitOff = updates.at(-1);
  assert.equal(explicitOff.selectionType, "individual");
  assert.deepEqual(explicitOff.selectedModules, []);
  assert.equal(explicitOff.doctorsSelected, false);

  await view.unmount();
  const remounted = await mount(moduleElement({ ...defaulted, ...explicitOff }, updates));
  assert.equal(remounted.container.querySelector('input[aria-label="Doctor Module"]').checked, false);
  assert.match(remounted.container.textContent, /No modules selected yet/);
  assert.match(remounted.container.textContent, /₹0\s*\/ month/);
  await remounted.unmount();
});

test("hydration normalization follows individual and resolved package selection", () => {
  const staleOn = normalizeDoctorsSelected({
    selectionType: "individual",
    selectedModules: ["doctors"],
    doctorsSelected: false,
  });
  assert.equal(staleOn.doctorsSelected, true);

  const staleOff = normalizeDoctorsSelected({
    selectionType: "individual",
    selectedModules: [],
    doctorsSelected: true,
    ownerPractitionerIntent: true,
  });
  assert.equal(staleOff.doctorsSelected, false);
  assert.equal(staleOff.ownerPractitionerIntent, undefined);

  assert.equal(effectiveDoctorsSelected({
    selectionType: "package",
    packageId: "clinical-package",
  }), undefined);
  assert.equal(effectiveDoctorsSelected({
    selectionType: "package",
    packageId: "clinical-package",
  }, catalog.packages), true);
});

test("Review renders the practitioner control from canonical selection, not stale boolean", async () => {
  const base = {
    facilityType: "doctor",
    specialization: "general-medicine",
    contactName: "Dr Test",
    selectionType: "individual",
    billingCycle: "monthly",
  };

  const staleOn = await mount(reviewElement({
    ...base,
    selectedModules: ["doctors"],
    doctorsSelected: false,
  }));
  const practitionerToggle = staleOn.container.querySelector('input[aria-label="Practicing as a Doctor"]');
  assert.ok(practitionerToggle);
  assert.equal(practitionerToggle.checked, true);
  assert.match(staleOn.container.textContent, /Doctor Module/);
  await staleOn.unmount();

  const explicitRoleOff = await mount(reviewElement({
    ...base,
    selectedModules: ["doctors"],
    doctorsSelected: false,
    ownerPractitionerIntent: false,
  }));
  assert.equal(explicitRoleOff.container.querySelector('input[aria-label="Practicing as a Doctor"]').checked, false);
  await explicitRoleOff.unmount();

  const staleOff = await mount(reviewElement({
    ...base,
    selectedModules: [],
    doctorsSelected: true,
    ownerPractitionerIntent: true,
  }));
  assert.equal(staleOff.container.querySelector('input[aria-label="Practicing as a Doctor"]'), null);
  assert.match(staleOff.container.textContent, /Organization Administrator only/);
  await staleOff.unmount();
});

test("Review uses cycle-relative renewal copy before payment", async () => {
  const common = {
    facilityType: "doctor",
    specialization: "general-medicine",
    contactName: "Dr Test",
    selectionType: "individual",
    selectedModules: ["doctors"],
    doctorsSelected: true,
  };

  const monthly = await mount(reviewElement({ ...common, billingCycle: "monthly" }));
  assert.match(monthly.container.textContent, /Recurring charge₹3,713 \/ month/);
  assert.match(monthly.container.textContent, /Billing cycleMonthly/);
  assert.match(monthly.container.textContent, /First renewal1 month after activation/);
  assert.doesNotMatch(monthly.container.textContent, /Next billing date/);
  await monthly.unmount();

  const yearly = await mount(reviewElement({ ...common, billingCycle: "yearly" }));
  assert.match(yearly.container.textContent, /Recurring charge₹3,713 \/ year/);
  assert.match(yearly.container.textContent, /Billing cycleYearly/);
  assert.match(yearly.container.textContent, /First renewal1 year after activation/);
  assert.doesNotMatch(yearly.container.textContent, /Next billing date/);
  await yearly.unmount();
});

test("Payment gates practitioner payload from canonical entitlement", async () => {
  const common = {
    verifiedToken: "frontend-test-token",
    orgName: "Test Practice",
    subdomain: "test-practice",
    contactName: "Dr Test",
    facilityType: "doctor",
    specialization: "general-medicine",
    selectionType: "individual",
    billingCycle: "monthly",
    ownerPractitionerIntent: true,
    ownerDoctorProfile: { name: "Dr Test" },
  };

  capturedRegister = undefined;
  const selected = await mount(React.createElement(PaymentStep, {
    data: { ...common, selectedModules: ["doctors"], doctorsSelected: false },
    updateData: () => {}, onNext: () => {}, onBack: () => {},
  }));
  const selectedButton = [...selected.container.querySelectorAll("button")]
    .find((button) => button.textContent.includes("Continue to secure payment"));
  await act(async () => { selectedButton.click(); });
  assert.equal(capturedRegister.payload.ownerPractitionerIntent, true);
  assert.equal(capturedRegister.payload.ownerDoctorProfile.name, "Dr Test");
  await selected.unmount();

  capturedRegister = undefined;
  const notSelected = await mount(React.createElement(PaymentStep, {
    data: { ...common, selectedModules: ["pharmacy"], doctorsSelected: true },
    updateData: () => {}, onNext: () => {}, onBack: () => {},
  }));
  const notSelectedButton = [...notSelected.container.querySelectorAll("button")]
    .find((button) => button.textContent.includes("Continue to secure payment"));
  await act(async () => { notSelectedButton.click(); });
  assert.equal(capturedRegister.payload.ownerPractitionerIntent, undefined);
  assert.equal(capturedRegister.payload.ownerDoctorProfile, undefined);
  await notSelected.unmount();
});

test("pending-payment resume renders coherent Review from canonical modules", async () => {
  const updates = [];
  const view = await mount(React.createElement(OnboardingWizard, {
    externalData: {
      sessionId: "pending-session",
      status: "pending_payment",
      facilityType: "doctor",
      specialization: "general-medicine",
      orgName: "Resume Practice",
      contactName: "Dr Resume",
      selectionType: "individual",
      selectedModules: ["doctors"],
      doctorsSelected: false,
      billingCycle: "monthly",
    },
    externalUpdateData: (patch) => updates.push(patch),
  }));

  const practitionerToggle = view.container.querySelector('input[aria-label="Practicing as a Doctor"]');
  assert.ok(practitionerToggle);
  assert.equal(practitionerToggle.checked, true);
  assert.match(view.container.textContent, /Doctor Module/);
  assert.doesNotMatch(view.container.textContent, /Doctor workspace: Not requested for the owner/);
  assert.ok(updates.some((patch) => patch.doctorsSelected === true));
  await view.unmount();
});
