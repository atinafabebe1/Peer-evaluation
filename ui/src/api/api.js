import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500' // Replace with your API base URL
});

// Add an interceptor to include the authorization header
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
