'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Metrics } from '@/types';

export const useMetrics = () => {
  const { data, isLoading, error } = useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: () => apiClient.getMetrics(),
  });

  return {
    metrics: data,
    isLoading,
    error,
  };
};

