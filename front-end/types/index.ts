export interface User {
  id?: string | number;
  name: string;
  email: string;
}

export interface Ticket {
  hash: string;
  name: string;
  subject: string;
  description: string;
  status: 1 | 2 | 3 | 4;
  priority: 1 | 2 | 3 | 4;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketDTO {
  name: string;
  subject: string;
  description: string;
  status: 1 | 2 | 3 | 4;
  priority: 1 | 2 | 3 | 4;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Metrics {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

