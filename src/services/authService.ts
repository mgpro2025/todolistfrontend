// src/services/authService.ts
import axios from 'axios';
import type { AuthCredentials } from '../types';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

const register = (credentials: AuthCredentials) => {
  return axios.post(`${API_URL}/register`, credentials);
};

// 1. AÑADIMOS la función de login
const login = (credentials: AuthCredentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

// 2. EXPORTAMOS el nuevo método
const authService = {
  register,
  login,
};

export default authService;