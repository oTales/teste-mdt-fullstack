'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      clearError();
      await login(data);
    } catch {
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-bg-surface border border-border rounded-[12px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] tracking-[.12em] uppercase text-text-muted mb-2">
            Bem-vindo(a) de volta
          </p>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">
            Faça login
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      type="email"
                      disabled={isLoading}
                      className="bg-bg-base border-border text-text-primary focus:ring-col-todo focus:border-col-todo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-col-progress" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        disabled={isLoading}
                        className="bg-bg-base border-border text-text-primary focus:ring-col-todo focus:border-col-todo pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-col-progress" />
                </FormItem>
              )}
            />

            {error && (
              <div className="bg-col-progress/10 border border-col-progress/20 text-col-progress text-sm px-4 py-3 rounded text-center font-mono">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-col-todo hover:bg-blue-600 text-white font-semibold py-3 flex justify-center items-center rounded-md"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Entrando...
                </span>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-surface text-text-muted font-mono uppercase text-[10px] tracking-widest">
                  ou
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-text-secondary">
              Não tem conta?{' '}
              <Link
                href="/register"
                className="text-col-todo hover:underline font-medium hover:text-blue-400 transition-colors"
              >
                Crie uma aqui
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

