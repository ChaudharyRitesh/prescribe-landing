import axios, { AxiosError } from 'axios';

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
        config.url.includes('/resend-verification-otp')
      );

      if (token && token !== 'undefined' && token !== 'null') {
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
  (error: AxiosError<{ message?: string, error?: string }>) => {
    // Handle global errors here (e.g. logging out on 401, showing toasts)
    const serverMessage = error.response?.data?.message;
    const serverError = error.response?.data?.error;
    
    // Prefer specific error message over generic "Server error"
    const message = (serverMessage === "Server error" ? serverError : (serverMessage || serverError)) 
      || error.message 
      || 'An unexpected error occurred';
    
    // Convert to a standardized error 
    return Promise.reject(new Error(message));
  }
);
