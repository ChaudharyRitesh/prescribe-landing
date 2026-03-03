import { apiClient } from '../axios';
import {
  CatalogResponse,
  InitiatePayload,
  InitiateResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
  VerifyMagicLinkPayload,
  VerifyMagicLinkResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  CheckSubdomainResponse,
  ReserveSubdomainPayload,
  ReserveSubdomainResponse,
  RegisterPayload,
  RegisterResponse,
  StatusResponse,
} from '../types/onboarding.types';

export const OnboardingService = {
  fetchCatalog: async (): Promise<CatalogResponse> => {
    return apiClient.get('/onboarding/catalog');
  },

  checkSubdomain: async (value: string): Promise<CheckSubdomainResponse> => {
    return apiClient.get(`/onboarding/check-subdomain?value=${encodeURIComponent(value)}`);
  },

  initiateOnboarding: async (payload: InitiatePayload): Promise<InitiateResponse> => {
    return apiClient.post('/onboarding/initiate', payload);
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    return apiClient.post('/onboarding/verify-otp', payload);
  },

  verifyMagicLink: async (payload: VerifyMagicLinkPayload): Promise<VerifyMagicLinkResponse> => {
    return apiClient.post('/onboarding/verify-magic-link', payload);
  },

  resendOtp: async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
    return apiClient.post('/onboarding/resend-otp', payload);
  },

  reserveSubdomain: async (
    payload: ReserveSubdomainPayload,
    token: string
  ): Promise<ReserveSubdomainResponse> => {
    return apiClient.post('/onboarding/reserve-subdomain', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  registerOrg: async (payload: RegisterPayload, token: string): Promise<RegisterResponse> => {
    return apiClient.post('/onboarding/register', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  pollProvisioningStatus: async (sessionId: string): Promise<StatusResponse> => {
    return apiClient.get(`/onboarding/status/${sessionId}`);
  },
};
