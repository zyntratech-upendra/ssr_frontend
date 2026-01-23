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

export const getStudentProfile = async (studentId) => {
  try {
    const response = await api.get(`/api/student/${studentId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const updateStudentProfile = async (studentId, data) => {
  try {
    const response = await api.put(`/student/${studentId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const createStudentProfile = async (data) => {
  try {
    const response = await api.post(`/student`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const uploadStudentImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/student/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};
