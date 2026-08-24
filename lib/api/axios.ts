import axios, { AxiosError } from 'axios';

export type FrontendApiError = Error & {
  status?: number;
  code?: string;
  field?: string;
};

// Get base URL from environment or use a default for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create a configured axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const explicitAuthorization = config.headers.get
        ? config.headers.get('Authorization')
        : config.headers['Authorization'];
      if (explicitAuthorization) return config;

      let token = localStorage.getItem('partner_token');
      
      // Fallback: Check cookies for partner_token if localStorage is empty or out-of-sync
      if (!token) {
        const match = document.cookie.split('; ').find(row => row.startsWith('partner_token='));
        if (match) token = match.split('=')[1];
      }

      // Routes that don't need a token
      const isPublicRoute = config.url && (
        config.url.includes('/login') || 
        config.url.includes('/register') || 
        config.url.includes('/forgot-password') ||
        config.url.includes('/reset-password') ||
        config.url.includes('/verify-otp') ||
        config.url.includes('/verify-2fa') ||
        config.url.includes('/resend-2fa-otp') ||
        config.url.includes('/resend-verification-otp') ||
        config.url.includes('/onboarding/initiate') ||
        config.url.includes('/onboarding/session/') ||
        config.url.includes('/onboarding/catalog') ||
        config.url.includes('/onboarding/org-types') ||
        config.url.includes('/onboarding/check-subdomain') ||
        config.url.includes('/onboarding/verify-mr') ||
        config.url.includes('/onboarding/verify-gst')
      );

      if (token && token !== 'undefined' && token !== 'null' && !isPublicRoute) {
        if (config.headers.set) {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } else if (!isPublicRoute) {
        // Only warn if it's NOT a public route and we have no token
        console.warn(`[Frontend Axios] No token found for protected route: ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<{ message?: string, error?: string, code?: string, field?: string }>) => {
    // Handle global errors here (e.g. logging out on 401, showing toasts)
    const serverMessage = error.response?.data?.message;
    const serverError = error.response?.data?.error;
    
    // Prefer specific error message over generic "Server error"
    const message = (serverMessage === "Server error" ? serverError : (serverMessage || serverError)) 
      || error.message 
      || 'An unexpected error occurred';
    
    // Preserve machine-readable response metadata for bounded frontend recovery flows while
    // continuing to expose only the existing safe Error message to generic consumers.
    const frontendError = new Error(message) as FrontendApiError;
    frontendError.status = error.response?.status;
    frontendError.code = error.response?.data?.code;
    frontendError.field = error.response?.data?.field;
    return Promise.reject(frontendError);
  }
);
