import axios, {AxiosInstance, AxiosError} from 'axios';
import {CreateTicketDTO, Metrics, AuthResponse} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        this.client.interceptors.request.use((config) => {
            const token = this.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    this.clearToken();
                    if (typeof window !== 'undefined') {
                        const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
                        if (!isAuthRoute) {
                            window.location.href = '/login';
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }

    setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    clearToken(): void {
        localStorage.removeItem('auth_token');
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const {data} = await this.client.post('/login', {email, password});
        this.setToken(data.token);
        return data;
    }

    async register(name: string, email: string, password: string, password_confirmation: string): Promise<AuthResponse> {
        const {data} = await this.client.post('/register', {name, email, password, password_confirmation});
        this.setToken(data.token);
        return data;
    }

    async logout() {
        const {data} = await this.client.post('/logout');
        this.clearToken();
        return data;
    }

    async getTickets(page: number = 1, filters?: { status?: number; priority?: number; search?: string }) {
        const { data } = await this.client.get('/tickets-paginated', {
            params: {
                page,
                ...(filters?.status && { status: filters.status }),
                ...(filters?.priority && { priority: filters.priority }),
                ...(filters?.search && { search: filters.search }),
            },
        });


        return data.data || data;
    }

    async getAllTickets(filters?: { status?: number; priority?: number; search?: string }) {
        const { data } = await this.client.get('/tickets', {
            params: {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.priority && { priority: filters.priority }),
                ...(filters?.search && { search: filters.search }),
            },
        });
        return data.data || data;
    }

    async getTicketsPaginated(page: number = 1) {
        const {data} = await this.client.get(`/tickets-paginated?page=${page}`);
        return data;
    }

    async getTicket(id: string) {
        const {data} = await this.client.get(`/tickets/${id}`);
        return data.data || data;
    }

    async createTicket(payload: CreateTicketDTO) {
        const {data} = await this.client.post('/tickets', payload);
        return data;
    }

    async updateTicket(id: string, payload: Partial<CreateTicketDTO>) {
        const {data} = await this.client.patch(`/tickets/${id}`, payload);
        return data;
    }

    async deleteTicket(id: string) {
        const {data} = await this.client.delete(`/tickets/${id}`);
        return data;
    }

    async getMetrics(): Promise<Metrics> {
        const {data} = await this.client.get('/metrics');
        return data.data;
    }
}

export const apiClient = new ApiClient();


