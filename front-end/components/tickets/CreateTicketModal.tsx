'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { SimpleSelect } from '@/components/ui/simple-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateTicket } from '@/hooks/useCreateTicket';
import { CreateTicketDTO } from '@/types';

const createTicketSchema = z.object({
    name: z.string().min(1, 'Nome do cliente é obrigatório'),
    subject: z.string().min(1, 'Assunto é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    status: z.number().min(1).max(4),
    priority: z.number().min(1).max(4),
});

type CreateTicketInput = z.infer<typeof createTicketSchema>;

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketModal({
  open,
  onOpenChange,
}: CreateTicketModalProps) {
  const { createTicket, isCreating } = useCreateTicket();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      name: '',
      subject: '',
      description: '',
      status: 1,
      priority: 2,
    },
  });

  const onSubmit = async (data: CreateTicketInput) => {
    try {
      setError(null);
      await createTicket(data as CreateTicketDTO);
      form.reset();
      onOpenChange(false);
    } catch {
      setError('Erro ao criar ticket');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Ticket</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      {...field}
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Assunto do ticket"
                      {...field}
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Descreva o problema..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <SimpleSelect 
                      value={String(field.value)} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isCreating}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isCreating}
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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
