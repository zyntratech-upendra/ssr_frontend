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

// ✅ Fetch all batches (no department filter here)
export const getAllBatches = async () => {
  try {
    const response = await api.get('/api/batches');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const getAllBatchesbyTeacher = async () => {
  try {
    const response = await api.get('/api/batches/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// ✅ Fetch a single batch by ID (and its departments)
export const getBatchById = async (batchId) => {
  try {
    console.log("Service",batchId)
    const response = await api.get(`/api/batches/${batchId}`);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// ✅ Optional (kept if used elsewhere)
export const createBatch = async (batchData) => {
  try {
    const response = await api.post('/api/batches', batchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// ✅ Fetch all departments (used in other components)
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export default api;
