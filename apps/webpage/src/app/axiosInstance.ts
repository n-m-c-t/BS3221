import axios from 'axios';
import { useAuth } from './contexts/AuthContext';

const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';

const API = axios.create({
  baseURL: `${backendURL}/api`,
});

API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default API;