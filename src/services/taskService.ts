// src/services/taskService.ts
import axios from 'axios';
import type { Task } from '../types';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/tasks`;

// Función para obtener las tareas del usuario autenticado
const getTasks = () => {
  // 1. Obtenemos el token del localStorage
  const token = localStorage.getItem('token');

  // 2. Hacemos la petición GET, enviando el token en la cabecera de autorización
  return axios.get<Task[]>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const createTask = (title: string, dueDate: string | null) => {
  const token = localStorage.getItem('token');
  return axios.post<Task>(API_URL, { title, dueDate }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const deleteTask = (taskId: number) => {
  const token = localStorage.getItem('token');
  // Hacemos una petición DELETE a la URL específica de la tarea
  return axios.delete(`${API_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updateTaskCompletion = (taskId: number, completed: boolean) => {
  const token = localStorage.getItem('token');
  // Hacemos una petición PUT a la URL específica, pasando el estado 'completed' como parámetro
  return axios.put<Task>(`${API_URL}/${taskId}`, null, { // El cuerpo es null porque enviamos los datos como parámetro
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      completed
    }
  });
};

const updateTaskTitle = (taskId: number, title: string) => {
  const token = localStorage.getItem('token');
  return axios.put<Task>(`${API_URL}/${taskId}/title`, { title }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const taskService = {
  getTasks,
  createTask,
  deleteTask,
  updateTaskCompletion,
  updateTaskTitle,
};

export default taskService;