// src/services/taskService.ts
import axios from 'axios';
import type { Task } from '../types';

const API_URL = 'http://localhost:8080/api/tasks';

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

const createTask = (title: string) => {
  const token = localStorage.getItem('token');
  // Hacemos una petición POST, enviando el título en el cuerpo
  return axios.post<Task>(API_URL, { title }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const taskService = {
  getTasks,
  createTask,
};

export default taskService;