export const ONBOARDING_SESSION_KEY = "kaero_onboarding_session";
export const ONBOARDING_CAPABILITY_KEY = "kaero_onboarding_capability";

type SessionCapability = {
  sessionId: string;
  verifiedToken: string;
};

type PersistableOnboardingState = Record<string, unknown> & {
  sessionId?: string;
  verifiedToken?: string;
  reverificationRequired?: boolean;
};

export function readStoredOnboardingSession<T extends PersistableOnboardingState = PersistableOnboardingState>(): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const saved = localStorage.getItem(ONBOARDING_SESSION_KEY);
    return saved ? JSON.parse(saved) as T : undefined;
  } catch {
    return undefined;
  }
}

export function readStoredOnboardingCapability(sessionId?: string): SessionCapability | undefined {
  if (typeof window === "undefined" || !sessionId) return undefined;
  try {
    const saved = sessionStorage.getItem(ONBOARDING_CAPABILITY_KEY);
    const capability = saved ? JSON.parse(saved) as Partial<SessionCapability> : undefined;
    return capability?.sessionId === sessionId && typeof capability.verifiedToken === "string"
      ? capability as SessionCapability
      : undefined;
  } catch {
    return undefined;
  }
}

export function persistOnboardingSession(data: PersistableOnboardingState) {
  if (typeof window === "undefined") return;
  const persistable = { ...data };
  delete persistable.verifiedToken;
  delete persistable.reverificationRequired;
  localStorage.setItem(ONBOARDING_SESSION_KEY, JSON.stringify(persistable));
}

export function persistOnboardingCapability(sessionId: string, verifiedToken: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    ONBOARDING_CAPABILITY_KEY,
    JSON.stringify({ sessionId, verifiedToken } satisfies SessionCapability),
  );
}

export function clearOnboardingCapability(sessionId?: string) {
  if (typeof window === "undefined") return;
  if (!sessionId || readStoredOnboardingCapability(sessionId)) {
    sessionStorage.removeItem(ONBOARDING_CAPABILITY_KEY);
  }
}
