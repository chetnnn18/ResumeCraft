import axios from 'axios';

/**
 * Shared axios instance for all backend API calls.
 *
 * - baseURL uses the Vite proxy (/api) in development so no CORS issues.
 * - 30 second timeout covers slower Gemini responses.
 * - Response interceptor normalises error messages so callers don't
 *   need to dig into error.response.data themselves.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalise error responses — extract the server message when available
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.message;
    const message = serverMessage || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
