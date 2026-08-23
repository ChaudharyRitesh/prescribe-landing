import { useQuery, useMutation } from '@tanstack/react-query';
import { OnboardingService } from '@/lib/api/services/onboarding.service';
import {
  InitiatePayload,
  VerifyOtpPayload,
  VerifyMagicLinkPayload,
  ResendOtpPayload,
  ReserveSubdomainPayload,
  RegisterPayload,
  PricePreviewPayload,
} from '@/lib/api/types/onboarding.types';

// Constants for queries
export const ONBOARDING_KEYS = {
  all: ['onboarding'] as const,
  catalog: () => [...ONBOARDING_KEYS.all, 'catalog'] as const,
  orgTypes: () => [...ONBOARDING_KEYS.all, 'org-types'] as const,
  pricePreview: (payload: PricePreviewPayload) => [...ONBOARDING_KEYS.all, 'price-preview', payload] as const,
  subdomain: (subdomain: string) => [...ONBOARDING_KEYS.all, 'subdomain', subdomain] as const,
  status: (sessionId: string) => [...ONBOARDING_KEYS.all, 'status', sessionId] as const,
};

// --- Queries ---

export const useCatalogQuery = (specialty?: string) => {
  return useQuery({
    queryKey: [...ONBOARDING_KEYS.catalog(), specialty],
    queryFn: () => OnboardingService.fetchCatalog(specialty),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrgTypesQuery = () => {
  return useQuery({
    queryKey: ONBOARDING_KEYS.orgTypes(),
    queryFn: () => OnboardingService.fetchOrgTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Server-authoritative price preview (Review/Payment screens). Non-mutating — safe to
// refetch on every selection change. `null` when the selection isn't complete enough to price.
export const usePricePreviewQuery = (payload: PricePreviewPayload | null) => {
  return useQuery({
    queryKey: payload ? ONBOARDING_KEYS.pricePreview(payload) : [...ONBOARDING_KEYS.all, 'price-preview', 'idle'],
    queryFn: () => OnboardingService.previewPrice(payload as PricePreviewPayload),
    enabled:
      !!payload &&
      (payload.selectionType === 'package' ? !!payload.packageId : (payload.selectedModules?.length ?? 0) > 0),
    staleTime: 60 * 1000,
  });
};

export const useSpecializedDepartmentsQuery = (specialty: string) => {
  return useQuery({
    queryKey: [...ONBOARDING_KEYS.all, 'specialties', 'departments', specialty],
    queryFn: () => OnboardingService.fetchSpecializedDepartments(specialty),
    enabled: !!specialty,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProvisioningStatusQuery = (sessionId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ONBOARDING_KEYS.status(sessionId),
    queryFn: () => OnboardingService.pollProvisioningStatus(sessionId),
    enabled: !!sessionId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Terminal states — stop polling. practitioner_setup_required is terminal for onboarding:
      // the tenant is usable; the owner completes Doctor setup from the Admin dashboard.
      if (status === 'provisioned' || status === 'failed' || status === 'quote_pending' || status === 'practitioner_setup_required') return false;
      return 3000; // Poll every 3 seconds
    },
    refetchIntervalInBackground: true,
  });
};

// --- Mutations ---

export const useInitiateMutation = () => {
  return useMutation({
    mutationFn: (payload: InitiatePayload) => OnboardingService.initiateOnboarding(payload),
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => OnboardingService.verifyOtp(payload),
  });
};

export const useVerifyMagicLinkMutation = () => {
  return useMutation({
    mutationFn: (payload: VerifyMagicLinkPayload) => OnboardingService.verifyMagicLink(payload),
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => OnboardingService.resendOtp(payload),
  });
};

export const useSubdomainCheckMutation = () => {
  return useMutation({
    mutationFn: (subdomain: string) => OnboardingService.checkSubdomain(subdomain),
  });
};

export const useVerifyMRMutation = () => {
  return useMutation({
    mutationFn: (code: string) => OnboardingService.verifyMR(code),
  });
};

export const useVerifyGstMutation = () => {
  return useMutation({
    mutationFn: (gstNumber: string) => OnboardingService.verifyGst(gstNumber),
  });
};

export const useReserveSubdomainMutation = () => {
  return useMutation({
    mutationFn: ({ subdomain, token }: { subdomain: string; token: string }) =>
      OnboardingService.reserveSubdomain({ subdomain }, token),
  });
};

export const useRegisterOrgMutation = () => {
  return useMutation({
    mutationFn: ({ payload, token }: { payload: RegisterPayload; token: string }) =>
      OnboardingService.registerOrg(payload, token),
  });
};
