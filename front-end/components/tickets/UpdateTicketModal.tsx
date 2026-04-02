'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SimpleSelect } from '@/components/ui/simple-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTickets } from '@/hooks/useTickets';
import { DeleteTicketModal } from './DeleteTicketModal';
import {
  TICKET_STATUS_LABEL,
  TICKET_PRIORITY_LABEL,
} from '@/lib/constants';
import { Ticket } from '@/types';

const updateTicketSchema = z.object({
    status: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    priority: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

interface UpdateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
}

export function UpdateTicketModal({
  open,
  onOpenChange,
  ticket,
}: UpdateTicketModalProps) {
  const { updateTicket, isUpdating, deleteTicket, isDeleting } = useTickets(1);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = useForm<UpdateTicketInput>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      status: ticket?.status || 1,
      priority: ticket?.priority || 2,
    },
  });

  useEffect(() => {
    if (ticket) {
      form.reset({
        status: ticket.status,
        priority: ticket.priority,
      });
    }
  }, [ticket, form]);

  const onSubmit = async (data: UpdateTicketInput) => {
    if (!ticket) return;

    try {
      setError(null);
      await new Promise((resolve, reject) => {
        updateTicket(
          { id: ticket.hash, data },
          {
            onSuccess: () => {
              onOpenChange(false);
              resolve(null);
            },
            onError: () => {
              setError('Erro ao atualizar ticket');
              reject(new Error('Erro ao atualizar ticket'));
            },
          }
        );
      });
    } catch {
      setError('Erro ao atualizar ticket');
    }
  };

  const handleDelete = async () => {
    if (!ticket) return;

    try {
      setError(null);
      await new Promise((resolve, reject) => {
        deleteTicket(ticket.hash, {
          onSuccess: () => {
            setDeleteOpen(false);
            onOpenChange(false);
            resolve(null);
          },
          onError: () => {
            setError('Erro ao excluir ticket');
            reject(new Error('Erro ao excluir ticket'));
          },
        });
      });
    } catch {
    }
  };

  if (!ticket) return null;

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atualizar Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-[12px] bg-bg-card border border-border p-5">
            <div className="mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 mb-1">Cliente</p>
              <p className="font-semibold text-text-primary text-sm">{ticket.name}</p>
            </div>
            <div className="mb-3">
              <p className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 mb-1">Assunto</p>
              <p className="font-semibold text-text-primary text-sm">{ticket.subject}</p>
            </div>
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[.12em] text-gray-400 mb-1">Descrição</p>
              <p className="text-sm text-text-primary">{ticket.description}</p>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center justify-center font-mono text-[10px] font-medium tracking-[.04em] px-2.5 py-1 rounded-[999px] border ${
                ticket.status === 1 ? 'text-col-todo border-col-todo bg-col-todo/10' :
                ticket.status === 2 ? 'text-col-progress border-col-progress bg-col-progress/10' :
                ticket.status === 3 ? 'text-col-review border-col-review bg-col-review/10' :
                'text-col-done border-col-done bg-col-done/10'
              }`}>
                {TICKET_STATUS_LABEL[ticket.status]}
              </span>
              <span className={`inline-flex items-center justify-center font-mono text-[10px] font-medium tracking-[.04em] px-2.5 py-1 rounded-[999px] border ${
                ticket.priority === 1 ? 'text-tag-design border-tag-design bg-tag-design/10' :
                ticket.priority === 2 ? 'text-tag-research border-tag-research bg-tag-research/10' :
                ticket.priority === 3 ? 'text-tag-qa border-tag-qa bg-tag-qa/10' :
                'text-tag-development border-tag-development bg-tag-development/10'
              }`}>
                {TICKET_PRIORITY_LABEL[ticket.priority]}
              </span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <SimpleSelect
                        value={String(field.value)}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                        disabled={isUpdating}
                      >
                        <option value="1">Aberto</option>
                        <option value="2">Em Progresso</option>
                        <option value="3">Resolvido</option>
                        <option value="4">Fechado</option>
                      </SimpleSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <SimpleSelect
                        value={String(field.value)}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                        disabled={isUpdating}
                      >
                        <option value="1">Baixa</option>
                        <option value="2">Normal</option>
                        <option value="3">Alta</option>
                        <option value="4">Urgente</option>
                      </SimpleSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={(e) => { e.preventDefault(); setDeleteOpen(true); }}
                  disabled={isUpdating || isDeleting}
                  className="w-full cursor-pointer flex items-center gap-2 sm:w-auto"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </Button>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    disabled={isUpdating || isDeleting}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUpdating || isDeleting} className="w-full sm:w-auto">
                    {isUpdating ? 'Atualizando...' : 'Atualizar'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>

    <DeleteTicketModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
    />
    </>
  );
}
