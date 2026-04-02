'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ticket, CreateTicketDTO } from '@/types';
import { DeleteTicketModal } from '@/components/tickets/DeleteTicketModal';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: ticket, isLoading, error } = useQuery<Ticket>({
    queryKey: ['ticket', id],
    queryFn: () => apiClient.getTicket(id),
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<CreateTicketDTO>) =>
      apiClient.updateTicket(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['allTickets'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['allTickets'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      router.push('/tickets');
    },
  });

    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4"></div>
          <p className="text-text-muted font-mono text-[11px] uppercase tracking-widest">Carregando ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-col-progress font-mono text-sm mb-4">Ticket não encontrado</p>
        <Button onClick={() => router.push('/tickets')} variant="outline" className="bg-bg-card hover:bg-bg-card-hover text-text-primary border-border">
          Voltar para Tickets
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    const statusNum = Number(newStatus);
    updateMutation.mutate({ status: statusNum as 1 | 2 | 3 | 4 });
  };

  const handlePriorityChange = (newPriority: string) => {
    const priorityNum = Number(newPriority);
    updateMutation.mutate({ priority: priorityNum as 1 | 2 | 3 | 4 });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 pt-2 gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[.15em] uppercase text-text-muted mb-3 flex items-center gap-2">
            Tickets <span className="text-border">/</span> #{ticket.hash}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight max-w-3xl line-clamp-2">
            {ticket.subject}
          </h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => router.push('/tickets')}
            className="bg-bg-card hover:bg-bg-card-hover text-text-secondary hover:text-text-primary border-border shrink-0"
          >
            ← Voltar
          </Button>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-[12px] p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-bg-card border border-border-subtle p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-col-review"></div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 block mb-2">
              Cliente
            </label>
            <p className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#555] to-[#333] border border-border flex items-center justify-center font-mono text-[9px] text-white">
                {ticket.name.charAt(0).toUpperCase()}
              </span>
              {ticket.name}
            </p>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 block mb-2">
              Data de Criação
            </label>
            <p className="text-base text-text-primary font-mono text-[13px]">
              {new Date(ticket.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-gray-400 tracking-[.12em]">CONTEXTO</span>
            <div className="flex-1 h-[1px] bg-border-subtle"></div>
          </div>
          <div className="bg-bg-base border border-border rounded-xl p-5 lg:p-6 min-h-[120px]">
            <p className="text-[14px] text-gray-100  leading-[1.65] whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-gray-400 tracking-[.12em]">CONFIGURAÇÕES</span>
            <div className="flex-1 h-[1px] bg-border-subtle"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-card border border-border p-6 rounded-xl">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 block mb-3">
                Status Atual
              </label>
              <div className="flex items-center gap-4">
                <Select
                  defaultValue={String(ticket.status)}
                  onValueChange={handleStatusChange}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="w-full bg-bg-base border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-surface border-border text-text-primary">
                    <SelectItem value="1">Aberto</SelectItem>
                    <SelectItem value="2">Em Progresso</SelectItem>
                    <SelectItem value="3">Resolvido</SelectItem>
                    <SelectItem value="4">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 block mb-3">
                Prioridade Atual
              </label>
              <div className="flex items-center gap-4">
                <Select
                  defaultValue={String(ticket.priority)}
                  onValueChange={handlePriorityChange}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="w-full bg-bg-base border-border text-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-surface border-border text-text-primary">
                    <SelectItem value="1">Baixa</SelectItem>
                    <SelectItem value="2">Normal</SelectItem>
                    <SelectItem value="3">Alta</SelectItem>
                    <SelectItem value="4">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
            <div className="justify-end flex gap-3 mt-6">
            <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                disabled={deleteMutation.isPending}
                className="shrink-0 cursor-pointer flex items-center gap-2"
            >
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
            </div>
        </div>

        {updateMutation.isPending && (
          <div className="bg-col-todo/10 border border-col-todo/20 text-col-todo px-4 py-3 rounded-xl flex items-center gap-3 font-mono text-[11px] tracking-wide mt-4">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-col-todo"></span>
            Atualizando ticket...
          </div>
        )}
        {updateMutation.isSuccess && (
          <div className="bg-col-done/10 border border-col-done/20 text-col-done px-4 py-3 rounded-xl font-mono text-[11px] tracking-wide mt-4 text-center">
            ✔ Ticket atualizado com sucesso!
          </div>
        )}
        {updateMutation.isError && (
          <div className="bg-col-progress/10 border border-col-progress/20 text-col-progress px-4 py-3 rounded-xl font-mono text-[11px] tracking-wide mt-4 text-center">
            ✖ Erro ao atualizar o ticket
          </div>
        )}
      </div>
    </div>

    <DeleteTicketModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
    />
    </>
  );
}
