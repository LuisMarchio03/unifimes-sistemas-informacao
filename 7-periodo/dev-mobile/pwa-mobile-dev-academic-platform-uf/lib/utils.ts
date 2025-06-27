import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um identificador único baseado em timestamp e caracteres aleatórios
 * @returns string Um ID único com prefixo 'proj-' para projetos
 */
export function generateId(): string {
  // Gera um timestamp
  const timestamp = Date.now().toString(36);

  // Gera 4 caracteres aleatórios
  const randomChars = Math.random().toString(36).substring(2, 6);

  // Combina o timestamp com os caracteres aleatórios
  return `proj-${timestamp}-${randomChars}`;
}
