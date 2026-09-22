import axios from 'axios';
import { handleClientMockRequest } from '../utils/clientMockApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hed_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses for auth expiration & seamless client fallback on Vercel
api.interceptors.response.use(
  (response) => {
    // If Vercel rewrote /api/* to index.html, response.data will be an HTML string
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE') || response.data.includes('<html'))) {
      const mockRes = handleClientMockRequest(response.config);
      return {
        ...response,
        status: mockRes.status,
        data: mockRes.data
      };
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    // If network error (backend not running), 404, or 5xx, resolve with resilient client data
    if (
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.response.status === 504 ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (error.response.status >= 500 && !config?.url?.includes('/auth/login'))
    ) {
      if (config) {
        const mockRes = handleClientMockRequest(config);
        return Promise.resolve({
          data: mockRes.data,
          status: mockRes.status,
          statusText: 'OK',
          headers: {},
          config
        });
      }
    }

    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/account')) {
        // Token expired or invalid
      }
    }
    return Promise.reject(error);
  }
);

export default api;
