// src/types.ts
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // Guardaremos la fecha como un string en formato ISO
  completedAt?: string; // El '?' indica que es opcional
}