import { useQuery, useMutation } from '@tanstack/react-query';
import { OnboardingService } from '@/lib/api/services/onboarding.service';
import {
  InitiatePayload,
  VerifyOtpPayload,
  VerifyMagicLinkPayload,
  ResendOtpPayload,
  ReserveSubdomainPayload,
  RegisterPayload,
} from '@/lib/api/types/onboarding.types';

// Constants for queries
export const ONBOARDING_KEYS = {
  all: ['onboarding'] as const,
  catalog: () => [...ONBOARDING_KEYS.all, 'catalog'] as const,
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
      if (status === 'provisioned' || status === 'failed') return false; // Stop polling
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
