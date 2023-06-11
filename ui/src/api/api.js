import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500/'
});

// Add a request interceptor to add the access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.get('accessToken');
    if (accessToken) {
      console.log('adding token');
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry && localStorage.get('accessToken')) {
      console.log('access token expired');
      originalRequest._retry = true;
      try {
        const response = await axios.get('/user/refereshToken');
        console.log(response);
        const { accessToken } = response.data;
        localStorage.set('accessToken', accessToken);
        return api(originalRequest);
      } catch (error) {
        console.log('Error refreshing access token: ', error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
