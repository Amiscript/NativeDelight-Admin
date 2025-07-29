// utils/handleApiError.ts
import { ApiError } from './api';

export const handleApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }
  return {
    status: 500,
    message: 'Unknown error occurred',
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'status' in error && 'message' in error;
};