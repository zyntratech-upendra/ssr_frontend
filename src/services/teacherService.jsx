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
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTeacherProfile = async (teacherId) => {
  try {
    const response = await api.get(`/api/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// ------------------------------
// Update teacher profile
// ------------------------------
export const updateTeacherProfile = async (teacherId, data) => {
  try {
    const response = await api.put(`/api/teacher/${teacherId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// ------------------------------
// Create teacher profile
// ------------------------------
export const createTeacherProfile = async (data) => {
  try {
    const response = await api.post(`/api/teacher`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// ------------------------------
// Upload teacher profile image (multipart form-data)
// ------------------------------
export const uploadTeacherImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/api/teacher/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};
