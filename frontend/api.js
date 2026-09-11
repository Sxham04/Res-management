import axios from 'axios';

// connect to backend server
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default api;