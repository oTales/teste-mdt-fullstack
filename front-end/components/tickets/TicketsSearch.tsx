'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TicketsSearchProps {
    onSearch: (search: string) => void;
    onStatusChange: (status: number) => void;
    onPriorityChange: (priority: number) => void;
}

export const TicketsSearch = ({
                                  onSearch,
                                  onStatusChange,
                                  onPriorityChange,
                              }: TicketsSearchProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <Input
                placeholder="Buscar por nome ou assunto..."
                onChange={(e) => onSearch(e.target.value)}
                className="flex-1"
            />

            <Select onValueChange={(value) => onStatusChange(Number(value))}>
                <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Todos os Status</SelectItem>
                    <SelectItem value="1">Aberto</SelectItem>
                    <SelectItem value="2">Em Progresso</SelectItem>
                    <SelectItem value="3">Resolvido</SelectItem>
                    <SelectItem value="4">Fechado</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => onPriorityChange(Number(value))}>
                <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Todas as Prioridades" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Todas as Prioridades</SelectItem>
                    <SelectItem value="1">Baixa</SelectItem>
                    <SelectItem value="2">Normal</SelectItem>
                    <SelectItem value="3">Alta</SelectItem>
                    <SelectItem value="4">Urgente</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
