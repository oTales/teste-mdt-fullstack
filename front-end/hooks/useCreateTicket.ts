'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateTicketDTO } from '@/types';

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateTicketDTO) => apiClient.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  return {
    createTicket: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    error: createMutation.error,
    isSuccess: createMutation.isSuccess,
  };
};


