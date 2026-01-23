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


export const fetchTeachersandCoordinatorsData = async (departmentId) => {
  
    try {
        const response = await api.get(`/api/coordinators/all?department=${departmentId}`)
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
}

export const promoteToCoordinatorfromTeacher = async (teacherId) => {
    console.log(teacherId)
    try {
        const response = await api.put(`/api/coordinators/${teacherId}/promote`);   
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }       
};

export const demoteToTeacherfromCoordinator = async (coordinatorId) => {
  console.log(coordinatorId);
    try {
        const response = await api.put(`/api/coordinators/${coordinatorId}/demote`);   
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }       
};  