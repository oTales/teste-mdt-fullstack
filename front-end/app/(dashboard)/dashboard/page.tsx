'use client';

import React from 'react';
import { useMetrics } from '@/hooks/useMetrics';

export default function DashboardPage() {
  const { metrics, isLoading, error } = useMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4"></div>
          <p className="text-text-muted font-mono text-[11px] uppercase tracking-widest">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-col-progress font-mono text-sm">Erro ao carregar métricas</p>
      </div>
    );
  }

  const metricsData = [
    {
      label: 'Total de Tickets',
      value: metrics.total_tickets,
      color: 'text-text-primary',
    },
    {
      label: 'Abertos',
      value: metrics.open_tickets,
      color: 'text-col-todo',
    },
    {
      label: 'Em Progresso',
      value: metrics.in_progress_tickets,
      color: 'text-col-progress',
    },
    {
      label: 'Resolvidos',
      value: metrics.resolved_tickets,
      color: 'text-col-review',
    },
    {
      label: 'Fechados',
      value: metrics.closed_tickets,
      color: 'text-col-done',
    },
  ];

  const totalTickets = metrics.total_tickets || 1;
  const percentages = {
    open: Math.round((metrics.open_tickets / totalTickets) * 100),
    inProgress: Math.round((metrics.in_progress_tickets / totalTickets) * 100),
    resolved: Math.round((metrics.resolved_tickets / totalTickets) * 100),
    closed: Math.round((metrics.closed_tickets / totalTickets) * 100),
  };

  return (
    <div className="space-y-10 font-sans">
      <div className="border-b border-border pb-6 pt-2">
        <p className="font-mono text-[11px] tracking-[.15em] uppercase text-text-muted mb-3">
          Dashboard
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-none">
          Visão <span className="text-col-todo">Geral</span>
        </h1>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[11px] text-text-muted tracking-[.12em]">01</span>
          <h2 className="text-[13px] font-semibold tracking-[.16em] uppercase text-text-secondary">Resumo de Tickets</h2>
          <div className="flex-1 h-[1px] bg-border"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {metricsData.map((metric, index) => (
            <div
              key={index}
              className="bg-bg-surface border border-border rounded-[12px] p-6 transition-colors duration-200 hover:border-[#444]"
            >
              <p className="font-mono font-semibold  text-xs tracking-[.12em] uppercase text-gray-300 mb-2.5">
                {metric.label}
              </p>
              <p className={`font-mono text-[24px] ${metric.color}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] text-text-muted tracking-[.12em]">02</span>
            <h3 className="text-[13px] font-semibold tracking-[.16em] uppercase text-text-secondary">Distribuição de Status</h3>
            <div className="flex-1 h-[1px] bg-border"></div>
          </div>
          
          <div className="bg-bg-surface border border-border rounded-[12px] p-8 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Abertos</span>
                <span className="font-mono text-[11px] font-bold text-col-todo">
                  {percentages.open}%
                </span>
              </div>
              <div className="w-full bg-bg-base border border-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-col-todo h-full transition-all"
                  style={{ width: `${percentages.open}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Em Progresso</span>
                <span className="font-mono text-[11px] font-bold text-col-progress">
                  {percentages.inProgress}%
                </span>
              </div>
              <div className="w-full bg-bg-base border border-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-col-progress h-full transition-all"
                  style={{ width: `${percentages.inProgress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Resolvidos</span>
                <span className="font-mono text-[11px] font-bold text-col-review">
                  {percentages.resolved}%
                </span>
              </div>
              <div className="w-full bg-bg-base border border-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-col-review h-full transition-all"
                  style={{ width: `${percentages.resolved}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">Fechados</span>
                <span className="font-mono text-[11px] font-bold text-col-done">
                  {percentages.closed}%
                </span>
              </div>
              <div className="w-full bg-bg-base border border-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-col-done h-full transition-all"
                  style={{ width: `${percentages.closed}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] text-text-muted tracking-[.12em]">03</span>
            <h3 className="text-[13px] font-semibold tracking-[.16em] uppercase text-text-secondary">Detalhes por Status</h3>
            <div className="flex-1 h-[1px] bg-border"></div>
          </div>
          
          <div className="bg-bg-surface border border-border rounded-[12px] p-8 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left font-mono text-[10px] uppercase tracking-[.12em] text-text-muted py-3">Status</th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-[.12em] text-text-muted py-3">Quantidade</th>
                  <th className="text-right font-mono text-[10px] uppercase tracking-[.12em] text-text-muted py-3">Percentual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-bg-card transition-colors">
                  <td className="py-4 px-3 text-col-todo font-medium">Abertos</td>
                  <td className="text-right font-mono text-[12px]">{metrics.open_tickets}</td>
                  <td className="text-right font-mono text-[12px] text-text-muted px-3">{percentages.open}%</td>
                </tr>
                <tr className="hover:bg-bg-card transition-colors">
                  <td className="py-4 px-3 text-col-progress font-medium">Em Progresso</td>
                  <td className="text-right font-mono text-[12px]">{metrics.in_progress_tickets}</td>
                  <td className="text-right font-mono text-[12px] text-text-muted px-3">{percentages.inProgress}%</td>
                </tr>
                <tr className="hover:bg-bg-card transition-colors">
                  <td className="py-4 px-3 text-col-review font-medium">Resolvidos</td>
                  <td className="text-right font-mono text-[12px]">{metrics.resolved_tickets}</td>
                  <td className="text-right font-mono text-[12px] text-text-muted px-3">{percentages.resolved}%</td>
                </tr>
                <tr className="hover:bg-bg-card transition-colors">
                  <td className="py-4 px-3 text-col-done font-medium">Fechados</td>
                  <td className="text-right font-mono text-[12px]">{metrics.closed_tickets}</td>
                  <td className="text-right font-mono text-[12px] text-text-muted px-3">{percentages.closed}%</td>
                </tr>
                <tr className="bg-bg-card border-t border-border mt-2 font-bold">
                  <td className="py-4 text-text-primary px-3">TOTAL</td>
                  <td className="text-right font-mono text-[14px] text-text-primary">{metrics.total_tickets}</td>
                  <td className="text-right font-mono text-[14px] text-text-primary px-3">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[11px] text-text-muted tracking-[.12em]">04</span>
          <h3 className="text-[13px] font-semibold tracking-[.16em] uppercase text-text-secondary">Resumo Executivo</h3>
          <div className="flex-1 h-[1px] bg-border"></div>
        </div>
        
        <div className="bg-gradient-to-br from-bg-surface to-bg-base border border-border rounded-[12px] p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div className="flex flex-col gap-2 border-l-2 border-col-review pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[.08em] text-text-muted">Taxa de Resolução</p>
              <p className="text-3xl font-mono text-text-primary">
                {Math.round((metrics.resolved_tickets / totalTickets) * 100)}%
              </p>
            </div>
            <div className="flex flex-col gap-2 border-l-2 border-col-todo pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[.08em] text-text-muted">Ativa</p>
              <p className="text-3xl font-mono text-text-primary">
                {metrics.open_tickets + metrics.in_progress_tickets}
              </p>
            </div>
            <div className="flex flex-col gap-2 border-l-2 border-col-done pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[.08em] text-text-muted">Concluída</p>
              <p className="text-3xl font-mono text-text-primary">
                {metrics.resolved_tickets + metrics.closed_tickets}
              </p>
            </div>
            <div className="flex flex-col gap-2 border-l-2 border-text-secondary pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[.08em] text-text-muted">Eficiência</p>
              <p className="text-3xl font-mono text-text-primary">
                {totalTickets > 0 ? Math.round((metrics.resolved_tickets / totalTickets) * 100) + '%' : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
