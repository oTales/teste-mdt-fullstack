'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  TICKET_PRIORITY_LABEL,
} from '@/lib/constants';
import { useAllTickets } from '@/hooks/useAllTickets';
import { CreateTicketModal } from './CreateTicketModal';
import { UpdateTicketModal } from './UpdateTicketModal';
import { Ticket } from '@/types';
import {MoreHorizontal, Paperclip, MessageSquare, User} from 'lucide-react';

export function KanbanBoard() {
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const { tickets, isLoading } = useAllTickets();

  const ticketsByStatus = useMemo(() => {
    const grouped = {
      1: [] as Ticket[],
      2: [] as Ticket[],
      3: [] as Ticket[],
      4: [] as Ticket[],
    };

    tickets.forEach((ticket: Ticket) => {
      if (ticket.status in grouped) {
        grouped[ticket.status as 1 | 2 | 3 | 4].push(ticket);
      }
    });

    return grouped;
  }, [tickets]);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setUpdateOpen(true);
  };

  const statuses = [
    { id: 1, label: 'Aberto', countColor: 'text-col-todo', dotColor: 'bg-col-todo' },
    { id: 2, label: 'Em progresso', countColor: 'text-col-progress', dotColor: 'bg-col-progress' },
    { id: 3, label: 'Resolvido', countColor: 'text-col-review', dotColor: 'bg-col-review' },
    { id: 4, label: 'Fechado', countColor: 'text-col-done', dotColor: 'bg-col-done' },
  ];

  return (
    <div className="space-y-8 font-sans h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-end border-b border-border pb-6 pt-2 shrink-0">
        <div>
          <p className="font-mono text-[11px] tracking-[.15em] uppercase text-text-muted mb-3">
            Tickets Board
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-none">
            Quadro de <span className="text-col-todo">Tickets</span>
          </h1>
        </div>
        <Button 
          onClick={() => setCreateOpen(true)} 
          size="lg" 
          className="bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border"
        >
          + Novo Ticket
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-flex h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-text-muted">Carregando tickets...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 min-h-0">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex flex-col h-full min-h-0"
            >
              <div className="flex items-center gap-3 mb-6 px-1 shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-medium text-white ${status.dotColor}`}>
                  {ticketsByStatus[status.id as 1 | 2 | 3 | 4].length}
                </div>
                <div className="flex-1">
                  <h2 className="text-[14px] font-semibold tracking-[.02em] text-text-primary">
                    {status.label}
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2 pb-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-text-muted transition-colors">
                {ticketsByStatus[status.id as 1 | 2 | 3 | 4].length === 0 ? (
                  <div className="flex items-center justify-center h-32 border border-dashed border-border rounded-xl">
                    <p className="text-text-muted text-sm font-mono uppercase tracking-widest text-[10px]">Empty</p>
                  </div>
                ) : (
                  ticketsByStatus[status.id as 1 | 2 | 3 | 4].map((ticket) => (
                    <div
                      key={ticket.hash}
                      className="bg-bg-card border border-border-subtle rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-bg-card-hover hover:border-[#333] mx-auto md:mx-0 w-full"
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <div className="font-mono text-[10px] text-text-muted tracking-[.08em] mb-2.5 uppercase">
                        #{ticket.hash.slice(0, 8)} - {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                      </div>

                      <div className="flex justify-between items-start gap-2 mb-[14px]">
                        <h3 className="text-[15px] font-semibold leading-[1.3] tracking-[-.01em] text-text-primary break-words">
                          {ticket.subject}
                        </h3>
                        <button className="text-text-muted hover:text-text-primary p-0.5 shrink-0 transition-colors">
                          <MoreHorizontal className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      <div className="flex gap-1.5 flex-wrap flex-col mb-[18px]">
                        <div className="text-xs text-text-secondary truncate w-full mb-1 flex items-center gap-1">
                          <User/> {ticket.name}
                        </div>
                        <div className="flex gap-1.5">
                          <span className={`px-[9px] py-[3px] rounded-[999px] font-mono text-[10px] font-medium tracking-[.04em] border ${
                            ticket.priority === 1 ? 'text-tag-design border-tag-design bg-tag-design/10' :
                            ticket.priority === 2 ? 'text-tag-research border-tag-research bg-tag-research/10' :
                            ticket.priority === 3 ? 'text-tag-qa border-tag-qa bg-tag-qa/10' :
                            'text-tag-development border-tag-development bg-tag-development/10'
                          }`}>
                            {TICKET_PRIORITY_LABEL[ticket.priority]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#555] to-[#333] border-2 border-bg-card text-white flex items-center justify-center font-mono text-[9px] font-bold shadow-sm z-10">
                            {ticket.name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-text-muted font-mono text-[11px]">
                          <span className="flex items-center gap-1 hover:text-text-secondary transition-colors cursor-default">
                            <Paperclip className="w-3.5 h-3.5" /> 1
                          </span>
                          <span className="flex items-center gap-1 hover:text-text-secondary transition-colors cursor-default">
                            <MessageSquare className="w-3.5 h-3.5" /> 2
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTicketModal open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateTicketModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        ticket={selectedTicket}
      />
    </div>
  );
}
