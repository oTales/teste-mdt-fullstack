'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { LoginInput, RegisterInput } from '@/lib/utils';

const getErrorMessage = (err: unknown, defaultMessage: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const errorResponse = (err as Record<string, unknown>).response as Record<string, unknown>;
    const data = errorResponse?.data as Record<string, unknown>;
    const errors = data?.errors as Record<string, string[]>;
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      return errors[firstErrorKey][0];
    }
    
    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }
  }
  
  if (err instanceof Error) {
    return err.message;
  }
  
  return defaultMessage;
};

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (data: LoginInput) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.login(data.email, data.password);
        localStorage.setItem('auth_token', response.token);
        router.push('/dashboard');

        return response;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Erro ao fazer login');
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.register(data.name, data.email, data.password, data.passwordConfirm);
        localStorage.setItem('auth_token', response.token);
        router.push('/dashboard');

        return response;
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Erro ao registrar');
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    register,
    isLoading,
    error,
    clearError,
  };
};

