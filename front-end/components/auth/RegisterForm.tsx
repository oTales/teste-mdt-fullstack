'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {FieldValues, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/utils';
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
import { Control } from 'react-hook-form';

export const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      clearError();
      await register(data);
    } catch {
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-bg-surface border border-border rounded-[12px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] tracking-[.12em] uppercase text-text-muted mb-2">
            Primeiro acesso
          </p>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">
            Criar nova conta
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">
                    Nome Completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Email</FormLabel>
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

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">
                    Confirmar Senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPasswordConfirm ? 'text' : 'password'}
                        disabled={isLoading}
                        className="bg-bg-base border-border text-text-primary focus:ring-col-todo focus:border-col-todo pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none"
                      >
                        {showPasswordConfirm ? (
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

            <div className="bg-bg-base border border-border p-4 rounded text-xs text-text-muted font-mono tracking-wide">
              <p className="uppercase text-[10px] text-text-secondary mb-2 tracking-widest">
                Requisitos de senha
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mínimo 8 caracteres</li>
                <li>Pelo menos uma letra maiúscula</li>
                <li>Pelo menos um número</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-col-todo hover:bg-blue-600 text-white font-semibold py-3 flex justify-center items-center rounded-md"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>{' '}
                  Registrando...
                </span>
              ) : (
                'Registrar'
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
              Já tem conta?{' '}
              <Link
                href="/login"
                className="text-col-todo hover:underline font-medium hover:text-blue-400 transition-colors"
              >
                Faça login aqui
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

