import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';
const API_USER = 'http://localhost:8080/api/v1/users'
axios.defaults.withCredentials = true;

export const login = async (email: string, password: string) => {
  await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
  const res = await axios.get(`${API_USER}/me`, { withCredentials: true });
  return res.data;
};

export const register = async (email: string, password: string, fullName: string, phoneNumber: string) => {
  const res = await axios.post(`${API_URL}/register`, { email, password, fullName, phoneNumber });
  return res.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/logout`);
};

export const getCurrentUser = async (token: string) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
