
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig, AxiosError } from 'axios';
import api, { ApiError } from './api';

export const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  ApiError
> => async ({ url, method, data, params }) => {
  try {
    const result = await api({
      url: baseUrl + url,
      method,
      data,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError<ApiError>;
    return {
      error: err.response?.data || {
        status: err.response?.status || 500,
        message: err.message,
      },
    };
  }
};