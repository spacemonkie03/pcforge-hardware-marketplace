import { apiClient } from '../services/apiClient';

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await apiClient.post('/users/register', payload);
  return res.data.data;
};

export const login = async (payload: { email: string; password: string }) => {
  const res = await apiClient.post('/users/login', payload);
  return res.data.data;
};

