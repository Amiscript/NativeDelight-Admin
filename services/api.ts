// utils/api.ts
import axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders
} from 'axios';
import { store } from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token || localStorage.getItem('token');
    const headers = new AxiosHeaders(config.headers);
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (config.data instanceof FormData) {
      headers.set('Content-Type', 'multipart/form-data');
    }

    return {
      ...config,
      headers
    };
  },
  (error: AxiosError<ApiError>) => Promise.reject(transformError(error))
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // store.dispatch(logout());
    }
    return Promise.reject(transformError(error));
  }
);

// Utility function to transform AxiosError to ApiError
const transformError = (error: AxiosError<ApiError>): ApiError => {
  if (error.response?.data) {
    return {
      status: error.response.status,
      message: error.response.data.message || error.message,
      errors: error.response.data.errors,
      code: error.response.data.code || error.code
    };
  }
  return {
    status: error.response?.status || 500,
    message: error.message,
    code: error.code
  };
};

// Typed HTTP methods with proper error handling
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export const put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export const patch = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export const upload = async <T>(url: string, formData: FormData): Promise<T> => {
  try {
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw transformError(error as AxiosError<ApiError>);
  }
};

export type { ApiError };
export default api;