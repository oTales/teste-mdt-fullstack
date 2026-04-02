'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket } from '@/types';
import {
  TICKET_STATUS_LABEL,
  TICKET_PRIORITY_LABEL,
} from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface TicketsTableProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-300 font-mono text-[11px] uppercase tracking-widest">
        Carregando tickets...
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="text-center py-16 text-gray-400 font-mono text-[11px] uppercase tracking-widest border border-dashed border-border rounded-[12px]">
        Nenhum ticket encontrado
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300">
              Data
            </TableHead>
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300">
              Cliente
            </TableHead>
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300">
              Assunto
            </TableHead>
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300">
              Status
            </TableHead>
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300">
              Prioridade
            </TableHead>
            <TableHead className="font-mono text-[12px] uppercase tracking-[.12em] text-gray-300 text-right">
              Ação
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.hash} className="border-b border-border hover:bg-bg-card transition-colors">
              <TableCell className="font-mono text-[12px] text-gray-300 whitespace-nowrap">
                {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-sm font-semibold text-text-primary">
                {ticket.name}
              </TableCell>
              <TableCell className="text-[13px] text-gray-300 truncate max-w-[200px]">
                {ticket.subject}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center justify-center font-mono text-[12px] font-medium tracking-[.04em] px-2.5 py-1 rounded-[999px] border ${
                  ticket.status === 1 ? 'text-col-todo border-col-todo bg-col-todo/10' :
                  ticket.status === 2 ? 'text-col-progress border-col-progress bg-col-progress/10' :
                  ticket.status === 3 ? 'text-col-review border-col-review bg-col-review/10' :
                  'text-col-done border-col-done bg-col-done/10'
                }`}>
                  {TICKET_STATUS_LABEL[ticket.status]}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center justify-center font-mono text-[12px] font-medium tracking-[.04em] px-2.5 py-1 rounded-[999px] border ${
                  ticket.priority === 1 ? 'text-tag-design border-tag-design bg-tag-design/10' :
                  ticket.priority === 2 ? 'text-tag-research border-tag-research bg-tag-research/10' :
                  ticket.priority === 3 ? 'text-tag-qa border-tag-qa bg-tag-qa/10' :
                  'text-tag-development border-tag-development bg-tag-development/10'
                }`}>
                  {TICKET_PRIORITY_LABEL[ticket.priority]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/tickets/${ticket.hash}`}>
                  <Button variant="ghost" size="sm" className="font-mono text-[12px] tracking-widest text-text-secondary hover:text-text-primary hover:bg-bg-card-hover border border-transparent hover:border-border">
                    DETALHES
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
