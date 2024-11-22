import axios from 'axios';

// Obtém o token do localStorage somente no lado do cliente
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Cria a instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL da sua API Laravel
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken() || ''}`, // Adiciona o token apenas se disponível
  },
});

// Interceptores para atualizar os cabeçalhos dinamicamente
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Funções para chamadas de API
export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const register = async (name: string, email: string, password: string) => {
  return api.post('/auth/register', { name, email, password });
};

export const getEnvironments = async () => {
  return api.get('/environments');
};

export const createEnvironment = async (data: { name: string; status: string }) => {
  return api.post('/environments', data);
};

export const updateEnvironment = async (id: number, data: { name: string; status: string }) => {
  return api.put(`/environments/${id}`, data);
};

export const deleteEnvironment = async (id: number) => {
  return api.delete(`/environments/${id}`);
};

export const getReservations = async () => {
  return api.get('/reservations');
};

export const createReservation = async (data: { environmentId: number; date: string; time: string }) => {
  return api.post('/reservations', data);
};

export const updateReservation = async (id: number, data: { date: string; time: string }) => {
  return api.put(`/reservations/${id}`, data);
};

export const cancelReservation = async (id: number) => {
  return api.delete(`/reservations/${id}`);
};
