'use client';

import React, { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { TicketsTable } from '@/components/tickets/TicketsTable';
import { TicketsSearch } from '@/components/tickets/TicketsSearch';
import { Button } from '@/components/ui/button';

export default function TicketsPage() {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<{ status?: number; priority?: number; search?: string }>({});

    const { tickets, pagination, isLoading } = useTickets(page, filters);

    const handleSearch = (searchTerm: string) => {
        setPage(1);
        setFilters((prev) => ({
            ...prev,
            search: searchTerm || undefined,
        }));
    };

    const handleStatusChange = (status: number) => {
        setPage(1);
        setFilters((prev) => ({
            ...prev,
            status: status === 0 ? undefined : status,
        }));
    };

    const handlePriorityChange = (priority: number) => {
        setPage(1);
        setFilters((prev) => ({
            ...prev,
            priority: priority === 0 ? undefined : priority,
        }));
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="border-b border-border pb-6 pt-2">
                <p className="font-mono text-[11px] tracking-[.15em] uppercase text-text-muted mb-3">
                    Gerenciamento
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-none">
                    Lista de <span className="text-col-todo">Tickets</span>
                </h1>
            </div>

            <div className="bg-bg-surface border border-border p-6 rounded-[12px]">
                <TicketsSearch
                    onSearch={handleSearch}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                />
            </div>

            <div className="bg-bg-surface border border-border rounded-[12px] overflow-hidden">
                <TicketsTable tickets={tickets} isLoading={isLoading} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between border-t border-border pt-6 gap-4">
                <div className="font-mono text-[11px] text-text-muted">
                    Mostrando <strong className="text-text-primary">{(page - 1) * pagination.perPage + 1}</strong> a{' '}
                    <strong className="text-text-primary">{Math.min(page * pagination.perPage, pagination.total)}</strong> de{' '}
                    <strong className="text-text-primary">{pagination.total}</strong> tickets
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                        variant="outline"
                        className="bg-bg-card hover:bg-bg-card-hover border-border text-text-primary"
                    >
                        ← Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(pagination.lastPage, 5) }, (_, i) => {
                            const start = Math.max(1, page - 2);
                            const pageNum = start + i;
                            return pageNum <= pagination.lastPage ? (
                                <Button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    disabled={isLoading}
                                    variant={page === pageNum ? 'default' : 'outline'}
                                    className={page === pageNum ? 'bg-col-todo hover:bg-blue-600 text-white border-0' : 'bg-bg-card hover:bg-bg-card-hover border-border text-text-secondary'}
                                    size="sm"
                                >
                                    {pageNum}
                                </Button>
                            ) : null;
                        })}
                    </div>

                    <Button
                        onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
                        disabled={page === pagination.lastPage || isLoading}
                        variant="outline"
                        className="bg-bg-card hover:bg-bg-card-hover border-border text-text-primary"
                    >
                        Próximo →
                    </Button>
                </div>
            </div>
        </div>
    );
}
