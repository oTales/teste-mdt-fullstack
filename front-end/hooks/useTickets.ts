'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateTicketDTO } from '@/types';

export const useTickets = (
    page: number = 1,
    filters?: { status?: number; priority?: number; search?: string }
) => {
    const queryClient = useQueryClient();

    const {
        data: ticketsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['tickets', page, filters],
        queryFn: () => apiClient.getTickets(page, filters),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateTicketDTO> }) =>
            apiClient.updateTicket(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            queryClient.invalidateQueries({ queryKey: ['allTickets'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    return {
        tickets: ticketsData?.data || [],
        pagination: {
            currentPage: ticketsData?.current_page || 1,
            lastPage: ticketsData?.last_page || 1,
            total: ticketsData?.total || 0,
            perPage: ticketsData?.per_page || 10,
        },
        isLoading,
        error,
        updateTicket: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteTicket: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
