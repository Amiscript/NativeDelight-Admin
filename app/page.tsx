"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../store/query/AuthApi';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

interface FormData {
  email: string;
  password: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

interface DisplayError {
  message: string;
  details?: string;
  fieldErrors: FieldErrors;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  console.log(login);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      dispatch(setCredentials({ token: response.token, user: response.user }));
      toast.success('Login successful');
      router.push('/dashboard');
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  interface LoginError {
    data?: {
      errors?: {
        email?: string[];
        password?: string[];
      };
    };
  }

  const displayError: DisplayError | null = error ? {
    message: 'Login failed',
    details: 'Invalid email or password',
    fieldErrors: {
      email: (error as LoginError)?.data?.errors?.email?.[0],
      password: (error as LoginError)?.data?.errors?.password?.[0],
    },
  } : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-800">Native Delight Menu</h1>
        <h2 className="text-2xl font-bold text-center mb-6"> Admin Login</h2>
        
        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{displayError.message}</p>
            {displayError.details && (
              <p className="text-red-600 text-sm mt-1">{displayError.details}</p>
            )}
            {displayError.fieldErrors?.email && (
              <p className="text-red-500 text-xs mt-1">{displayError.fieldErrors.email}</p>
            )}
            {displayError.fieldErrors?.password && (
              <p className="text-red-500 text-xs mt-1">{displayError.fieldErrors.password}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                displayError?.fieldErrors?.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  displayError?.fieldErrors?.password ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10`}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;