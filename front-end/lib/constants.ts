export const TICKET_STATUS = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
} as const;

export const TICKET_STATUS_LABEL: Record<number, string> = {
  1: 'Aberto',
  2: 'Em Progresso',
  3: 'Resolvido',
  4: 'Fechado',
};

export const TICKET_STATUS_COLOR: Record<number, string> = {
  1: 'bg-red-500/50',
  2: 'bg-yellow-500/50',
  3: 'bg-green-500/50',
  4: 'bg-gray-500/50',
};

export const TICKET_PRIORITY = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  URGENT: 4,
} as const;

export const TICKET_PRIORITY_LABEL: Record<number, string> = {
  1: 'Baixa',
  2: 'Normal',
  3: 'Alta',
  4: 'Urgente',
};

export const TICKET_PRIORITY_COLOR: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-orange-500',
  4: 'bg-red-500',
};

