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

export const fetchAllSubjects = async () => {
  try {
    const response = await api.get('/api/subjects');            
    
    return response.data;
  } catch (error) {     

    throw error.response?.data || { message: "Network error" };
  }
};

export const createSubject = async (subjectData) => {
  try {     
    const response = await api.post('/api/subjects', subjectData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};
export const updateSubject = async (subjectId, subjectData) => {
  try {     
    const response = await api.put(`/api/subjects/${subjectId}`, subjectData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: "Network error" };
    }
};
export const deleteSubject = async (subjectId) => {
    try {   
        const response = await api.delete(`/api/subjects/${subjectId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Network error" };
    }
};
export const fetchSubjectsByDepartmentAndYear = async (departmentId, year) => {
  try {
    const response = await api.get(`/api/subjects?department=${departmentId}&year=${year}`);
    return response.data;
  }
    catch (error) {

    throw error.response?.data || { message: "Network error" };

    }
};