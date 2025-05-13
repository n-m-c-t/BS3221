import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import * as dotenv from 'dotenv';

// const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';
const backendURL = 'https://bs3221-reverse-proxy.greenwater-a485c573.uksouth.azurecontainerapps.io';

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