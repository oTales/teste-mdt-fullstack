'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateTicketDTO } from '@/types';

export const useAllTickets = (
    filters?: { status?: number; priority?: number; search?: string }
) => {
    const queryClient = useQueryClient();

    const {
        data: tickets = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['allTickets', filters],
        queryFn: () => apiClient.getAllTickets(filters),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateTicketDTO> }) =>
            apiClient.updateTicket(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    return {
        tickets: Array.isArray(tickets) ? tickets : [],
        isLoading,
        error,
        updateTicket: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteTicket: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
