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
Module._extensions[".css"] = (module) => { module.exports = {}; };
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
  modules: [{
    _id: "doctor-module-fixture",
    slug: "doctors",
    label: "Doctors & Consultation",
    category: "Clinical",
    pricing: { monthly: 3147, yearly: 31470 },
    recommendedFor: ["doctor"],
    isActive: true,
    order: 1,
  }],
  packages: [],
};
const orgTypes = [{
  _id: "doctor-org-fixture",
  slug: "doctor",
  label: "Doctor / Professional Practice",
  multiBranchEligible: false,
  isActive: true,
  order: 1,
  subTypes: [{ id: "general-medicine", label: "General Medicine" }],
}];

let searchValues = new Map();
let fetchSessionBehavior;
let verifyOtpResponse = { success: true, verified: true, verifiedToken: "renewed-token" };
let provisioningStatus = { success: true, status: "failed" };
let resumeBehavior;
let registerBehavior;
let network;

function resetNetwork() {
  network = {
    fetchSession: [],
    initiate: 0,
    resendOtp: 0,
    verifyOtp: 0,
    registerOrg: 0,
    verifyPayment: 0,
    razorpayLoad: 0,
    razorpayOpen: 0,
    resumeProvisioning: [],
    statusRefetch: 0,
  };
  fetchSessionBehavior = async (sessionId, token) => ({
    success: true,
    data: fullSession(sessionId, token),
  });
  resumeBehavior = (_token, options) => options.onSuccess({
    success: true,
    status: "provisioning",
    sessionId: "paid-session",
  });
  registerBehavior = (_request, options) => options.onError({
    status: 409,
    code: "PAID_ONBOARDING_RESUME_REQUIRED",
  });
  provisioningStatus = { success: true, status: "failed" };
  verifyOtpResponse = { success: true, verified: true, verifiedToken: "renewed-token" };
}

const serviceMock = {
  fetchSession: async (sessionId, token) => {
    network.fetchSession.push({ sessionId, token });
    return fetchSessionBehavior(sessionId, token);
  },
};

const onboardingHooks = {
  useCatalogQuery: () => ({ data: catalog, isLoading: false, error: null }),
  useOrgTypesQuery: () => ({ data: { data: orgTypes }, isLoading: false }),
  usePricePreviewQuery: (payload) => ({
    data: payload ? { data: { subtotal: 3147, gst: 566.46, gstRate: 0.18, total: 3713.46 } } : undefined,
    isLoading: false,
    isError: false,
  }),
  useInitiateMutation: () => ({
    mutate: () => { network.initiate += 1; },
    isPending: false,
    error: null,
  }),
  useVerifyOtpMutation: () => ({
    mutate: (_payload, options) => {
      network.verifyOtp += 1;
      options.onSuccess(verifyOtpResponse);
    },
    isPending: false,
    error: null,
  }),
  useResendOtpMutation: () => ({
    mutate: (_payload, options) => {
      network.resendOtp += 1;
      options.onSuccess({ success: true });
    },
    isPending: false,
  }),
  useProvisioningStatusQuery: () => ({
    data: provisioningStatus,
    isError: false,
    refetch: async () => {
      network.statusRefetch += 1;
      return { data: provisioningStatus };
    },
  }),
  useResumeProvisioningMutation: () => ({
    mutate: (token, options) => {
      network.resumeProvisioning.push(token);
      resumeBehavior(token, options);
    },
    isPending: false,
  }),
  useRegisterOrgMutation: () => ({
    mutate: (request, options) => {
      network.registerOrg += 1;
      registerBehavior(request, options);
    },
    isPending: false,
  }),
};

Module._load = function loadWithFrontendMocks(request, parent, isMain) {
  if (request === "next/navigation") {
    return { useSearchParams: () => ({ get: (key) => searchValues.get(key) || null }) };
  }
  if (request === "@/hooks/queries/useOnboarding") return onboardingHooks;
  if (request === "@/lib/api/services/onboarding.service") return { OnboardingService: serviceMock };
  if (request === "@/lib/services/razorpay.service") {
    return { loadRazorpayScript: async () => { network.razorpayLoad += 1; return true; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/onboarding" });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.IS_REACT_ACT_ENVIRONMENT = true;
window.scrollTo = () => {};
window.Razorpay = function Razorpay() {
  return { open: () => { network.razorpayOpen += 1; }, on: () => {} };
};
global.fetch = async () => {
  network.verifyPayment += 1;
  return { json: async () => ({ success: true }) };
};

const React = require("react");
const { act } = React;
const { createRoot } = require("react-dom/client");
const { OnboardingContent } = require("../app/onboarding/page.tsx");
const { ProvisioningStatus } = require("../components/onboarding/steps/ProvisioningStatus.tsx");
const { PaymentStep } = require("../components/onboarding/steps/PaymentStep.tsx");
const { ModuleCatalogSelection } = require("../components/onboarding/steps/ModuleCatalogSelection.tsx");
const { ReviewStep } = require("../components/onboarding/steps/ReviewStep.tsx");
const {
  ONBOARDING_CAPABILITY_KEY,
  ONBOARDING_SESSION_KEY,
} = require("../components/onboarding/onboardingSessionStorage.ts");

async function mount(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(element); });
  return {
    container,
    async unmount() {
      await act(async () => { root.unmount(); });
      container.remove();
    },
  };
}

async function flush() {
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
}

function fullSession(sessionId = "paid-session") {
  return {
    sessionId,
    status: "pending_payment",
    facilityType: "doctor",
    specialization: "general-medicine",
    orgName: "Recovery Practice",
    subdomain: "recovery-practice",
    contactName: "Dr Recovery",
    selectionType: "individual",
    selectedModules: ["doctors"],
    doctorsSelected: true,
    ownerPractitionerIntent: true,
    ownerDoctorProfile: { name: "Dr Recovery" },
    billingCycle: "monthly",
    termsAccepted: true,
  };
}

function resetBrowser() {
  localStorage.clear();
  sessionStorage.clear();
  searchValues = new Map();
  resetNetwork();
}

function setStoredSession(session, token) {
  localStorage.setItem(ONBOARDING_SESSION_KEY, JSON.stringify(session));
  if (token) {
    sessionStorage.setItem(
      ONBOARDING_CAPABILITY_KEY,
      JSON.stringify({ sessionId: session.sessionId, verifiedToken: token }),
    );
  }
}

function clickButton(container, label) {
  const button = [...container.querySelectorAll("button")]
    .find((candidate) => candidate.textContent.includes(label));
  assert.ok(button, `Expected button containing ${label}`);
  act(() => { button.click(); });
}

function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(input, value);
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

test("valid-token reload restores the stored session with the capability outside the URL", async () => {
  resetBrowser();
  setStoredSession(fullSession("valid-session"), "valid-token");
  const view = await mount(React.createElement(OnboardingContent));
  await flush();

  assert.deepEqual(network.fetchSession, [{ sessionId: "valid-session", token: "valid-token" }]);
  assert.match(view.container.textContent, /Doctors & Consultation/);
  assert.match(view.container.textContent, /Practicing as a Doctor/);
  assert.equal(window.location.search.includes("valid-token"), false);
  await view.unmount();
});

test("sessionId without a token selects existing OTP re-verification without fresh onboarding", async () => {
  resetBrowser();
  setStoredSession({ sessionId: "tokenless-session", status: "failed" });
  fetchSessionBehavior = async (sessionId) => ({
    success: true,
    code: "REVERIFICATION_REQUIRED",
    data: { sessionId, status: "failed" },
  });
  const view = await mount(React.createElement(OnboardingContent));
  await flush();

  assert.deepEqual(network.fetchSession, [{ sessionId: "tokenless-session", token: undefined }]);
  assert.match(view.container.textContent, /Request a new 6-digit code/);
  assert.doesNotMatch(view.container.textContent, /Change email/);
  assert.equal(JSON.parse(localStorage.getItem(ONBOARDING_SESSION_KEY)).sessionId, "tokenless-session");
  assert.equal(network.initiate, 0);
  assert.equal(network.registerOrg, 0);
  assert.equal(network.razorpayOpen, 0);
  await view.unmount();
});

test("expired token is discarded, OTP renews it, and the same session is fetched again", async () => {
  resetBrowser();
  setStoredSession({ sessionId: "expired-session", status: "failed" }, "expired-token");
  fetchSessionBehavior = async (sessionId, token) => token === "renewed-token"
    ? { success: true, data: fullSession(sessionId) }
    : { success: true, code: "REVERIFICATION_REQUIRED", data: { sessionId, status: "failed" } };
  const view = await mount(React.createElement(OnboardingContent));
  await flush();
  assert.equal(sessionStorage.getItem(ONBOARDING_CAPABILITY_KEY), null);

  const inputs = [...view.container.querySelectorAll("input[aria-label^='Digit']")];
  assert.equal(inputs.length, 6);
  await act(async () => {
    inputs.forEach((input) => setInputValue(input, "1"));
  });
  clickButton(view.container, "Verify");
  await flush();

  assert.deepEqual(network.fetchSession, [
    { sessionId: "expired-session", token: "expired-token" },
    { sessionId: "expired-session", token: "renewed-token" },
  ]);
  assert.match(view.container.textContent, /Practicing as a Doctor/);
  assert.equal(network.registerOrg, 0);
  assert.equal(network.razorpayOpen, 0);
  await view.unmount();
});

function StatefulProvisioning({ initialData, updates }) {
  const [data, setData] = React.useState(initialData);
  return React.createElement(ProvisioningStatus, {
    data,
    updateData: (patch) => {
      updates.push(patch);
      setData((previous) => ({ ...previous, ...patch }));
    },
  });
}

test("failed provisioning Try again resumes the same session and continues polling with no checkout calls", async () => {
  resetBrowser();
  provisioningStatus = { success: true, status: "pending_payment" };
  localStorage.setItem(ONBOARDING_SESSION_KEY, JSON.stringify({ sessionId: "paid-session", status: "failed" }));
  const updates = [];
  resumeBehavior = (token, options) => {
    assert.equal(token, "paid-token");
    provisioningStatus = { success: true, status: "provisioning" };
    options.onSuccess({ success: true, status: "provisioning", sessionId: "paid-session" });
  };
  const view = await mount(React.createElement(StatefulProvisioning, {
    initialData: {
      sessionId: "paid-session",
      verifiedToken: "paid-token",
      status: "failed",
      paidResumeRequired: true,
    },
    updates,
  }));
  clickButton(view.container, "Try again");
  await flush();

  assert.deepEqual(network.resumeProvisioning, ["paid-token"]);
  assert.equal(JSON.parse(localStorage.getItem(ONBOARDING_SESSION_KEY)).sessionId, "paid-session");
  assert.equal(network.statusRefetch, 1);
  assert.match(view.container.textContent, /Setting up your workspace/);
  assert.equal(network.initiate, 0);
  assert.equal(network.registerOrg, 0);
  assert.equal(network.verifyPayment, 0);
  assert.equal(network.razorpayLoad, 0);
  assert.equal(network.razorpayOpen, 0);
  await view.unmount();
});

test("resume-provisioning provisioned response uses the existing success path", async () => {
  resetBrowser();
  const updates = [];
  resumeBehavior = (_token, options) => options.onSuccess({
    success: true,
    status: "provisioned",
    sessionId: "paid-session",
    dashboardUrl: "https://paid.kaeroprescribe.com",
  });
  const view = await mount(React.createElement(StatefulProvisioning, {
    initialData: { sessionId: "paid-session", verifiedToken: "paid-token", status: "failed" },
    updates,
  }));
  clickButton(view.container, "Try again");
  await flush();

  assert.match(view.container.textContent, /Your workspace is ready/);
  assert.match(view.container.textContent, /paid\.kaeroprescribe\.com/);
  assert.equal(network.razorpayOpen, 0);
  await view.unmount();
});

test("NOT_RESUMABLE and session-not-found responses are terminal support states", async () => {
  for (const scenario of [
    { error: { status: 409, code: "NOT_RESUMABLE" }, message: /needs support/ },
    { error: { status: 404 }, message: /Session not found/ },
  ]) {
    resetBrowser();
    const updates = [];
    resumeBehavior = (_token, options) => options.onError(scenario.error);
    const view = await mount(React.createElement(StatefulProvisioning, {
      initialData: { sessionId: "paid-session", verifiedToken: "paid-token", status: "failed" },
      updates,
    }));
    clickButton(view.container, "Try again");
    await flush();

    assert.match(view.container.textContent, scenario.message);
    assert.match(view.container.textContent, /Contact support/);
    assert.doesNotMatch(view.container.textContent, /Continue to secure payment/);
    assert.equal(network.razorpayOpen, 0);
    await view.unmount();
  }
});

test("missing or rejected resume capability preserves the session and requests OTP re-verification", async () => {
  resetBrowser();
  const missingUpdates = [];
  const missing = await mount(React.createElement(StatefulProvisioning, {
    initialData: { sessionId: "paid-session", status: "failed" },
    updates: missingUpdates,
  }));
  clickButton(missing.container, "Try again");
  assert.equal(network.resumeProvisioning.length, 0);
  assert.equal(missingUpdates.at(-1).reverificationRequired, true);
  assert.equal(missingUpdates.at(-1).sessionId, undefined);
  await missing.unmount();

  resetBrowser();
  const rejectedUpdates = [];
  resumeBehavior = (_token, options) => options.onError({ status: 401 });
  const rejected = await mount(React.createElement(StatefulProvisioning, {
    initialData: { sessionId: "paid-session", verifiedToken: "expired-token", status: "failed" },
    updates: rejectedUpdates,
  }));
  clickButton(rejected.container, "Try again");
  await flush();
  assert.deepEqual(network.resumeProvisioning, ["expired-token"]);
  assert.equal(rejectedUpdates.at(-1).reverificationRequired, true);
  assert.equal(rejectedUpdates.at(-1).verifiedToken, undefined);
  assert.equal(network.registerOrg, 0);
  assert.equal(network.razorpayOpen, 0);
  await rejected.unmount();
});

function paymentData(overrides = {}) {
  return {
    ...fullSession("paid-session"),
    verifiedToken: "paid-token",
    ...overrides,
  };
}

test("PAID_ONBOARDING_RESUME_REQUIRED never opens Razorpay and only routes a held capability to recovery", async () => {
  resetBrowser();
  const updates = [];
  let nextCalls = 0;
  const held = await mount(React.createElement(PaymentStep, {
    data: paymentData(),
    updateData: (patch) => updates.push(patch),
    onNext: () => { nextCalls += 1; },
    onBack: () => {},
  }));
  clickButton(held.container, "Continue to secure payment");
  await flush();

  assert.equal(network.registerOrg, 1);
  assert.equal(nextCalls, 1);
  assert.equal(updates.at(-1).paidResumeRequired, true);
  assert.equal(network.razorpayLoad, 0);
  assert.equal(network.razorpayOpen, 0);
  assert.equal(network.verifyPayment, 0);
  await held.unmount();

  resetBrowser();
  const lost = await mount(React.createElement(PaymentStep, {
    data: paymentData({ sessionId: undefined }),
    updateData: () => {},
    onNext: () => { nextCalls += 1; },
    onBack: () => {},
  }));
  clickButton(lost.container, "Continue to secure payment");
  await flush();
  assert.match(lost.container.textContent, /previous paid onboarding attempt needs recovery/i);
  assert.match(lost.container.textContent, /Contact support/);
  assert.equal(network.razorpayOpen, 0);
  await lost.unmount();
});

test("Doctor professional-practice module and practitioner controls remain coherent", async () => {
  resetBrowser();
  const updates = [];
  const fresh = { facilityType: "doctor", specialization: "general-medicine", contactName: "Dr Guard" };
  const configure = await mount(React.createElement(ModuleCatalogSelection, {
    data: fresh,
    updateData: (patch) => updates.push(patch),
    onNext: () => {},
    onBack: () => {},
  }));
  assert.equal(configure.container.querySelector('input[aria-label="Doctors & Consultation"]').checked, true);
  const selected = { ...fresh, ...updates.at(-1) };
  await configure.unmount();

  const review = await mount(React.createElement(ReviewStep, {
    data: selected,
    updateData: () => {},
    onNext: () => {},
    onBack: () => {},
    onEdit: () => {},
  }));
  assert.ok(review.container.querySelector('input[aria-label="Practicing as a Doctor"]'));
  await review.unmount();
});

test("onboarding service sends capabilities only in Authorization headers", async () => {
  resetBrowser();
  const { apiClient } = require("../lib/api/axios.ts");
  const { OnboardingService } = require("../lib/api/services/onboarding.service.ts");
  const originalGet = apiClient.get;
  const originalPost = apiClient.post;
  const calls = [];
  apiClient.get = async (url, config) => { calls.push({ method: "GET", url, config }); return { success: true }; };
  apiClient.post = async (url, body, config) => { calls.push({ method: "POST", url, body, config }); return { success: true }; };
  try {
    await OnboardingService.fetchSession("same-session", "header-token");
    await OnboardingService.resumeProvisioning("header-token");
  } finally {
    apiClient.get = originalGet;
    apiClient.post = originalPost;
  }

  assert.equal(calls[0].url, "/onboarding/session/same-session");
  assert.equal(calls[0].url.includes("header-token"), false);
  assert.equal(calls[0].config.headers.Authorization, "Bearer header-token");
  assert.equal(calls[1].url, "/onboarding/resume-provisioning");
  assert.equal(calls[1].body, undefined);
  assert.equal(calls[1].config.headers.Authorization, "Bearer header-token");
});
