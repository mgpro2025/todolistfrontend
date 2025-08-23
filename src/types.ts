// src/types.ts
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // Guardaremos la fecha como un string en formato ISO
  completedAt?: string; // El '?' indica que es opcional
}

export interface AuthCredentials {
  email: string;
  password?: string; // Hacemos la contraseña opcional por si la usamos para el login
}