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
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // We can add auth tokens here if needed, e.g.
    // const token = localStorage.getItem('onboarding_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Convert to a standardized error 
    return Promise.reject(new Error(message));
  }
);
