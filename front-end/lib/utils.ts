import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .min(1, "Senha é obrigatória"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres"),
    email: z
      .string()
      .email("Email inválido")
      .min(1, "Email é obrigatório"),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    passwordConfirm: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Senhas não coincidem",
    path: ["passwordConfirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
