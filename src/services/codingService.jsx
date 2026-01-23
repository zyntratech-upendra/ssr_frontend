import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const fetchCodingProblems = async (platform) => {
    try {
        
        const response = await api.get(`/api/problems/${platform}`);
        
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export default api;
