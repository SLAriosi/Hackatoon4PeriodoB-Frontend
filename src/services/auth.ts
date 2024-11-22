import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Alterar para a URL correta da sua API

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);  // Armazena o JWT no localStorage
  }
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');  // Remove o token ao fazer logout
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();  // Verifica se há um token no localStorage
};
