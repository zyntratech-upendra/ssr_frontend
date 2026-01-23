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


export const  fetchAllSemsters = async () => {
  try {
    const response = await api.get('/api/semesters');   
    console.log(response.data)
    return response.data;
    } catch (error) {   
    throw error.response?.data || { message: 'Network error' };
  }
}

export const createSemester = async (semesterData) => {
  try {
    console.log("Creating semester:", semesterData);
    const response = await api.post('/api/semesters', semesterData);
    console.log("Semester created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating semester:", error);
    throw error.response?.data || { message: 'Network error' };
  } 
};


export const updateSemester = async (semesterId, semesterData) => {
  try {
    console.log("Updating semester:", semesterData);    
    const response = await api.put(`/api/semesters/${semesterId}`, semesterData);
    console.log("Semester updated successfully:", response.data);
    return response.data;
  }
    catch (error) {
    console.error("Error updating semester:", error);   
    throw error.response?.data || { message: 'Network error' };
    }
};

export const deleteSemester = async (semesterId) => {
  try {
    console.log("Deleting semester:", semesterId);      
    const response = await api.delete(`/api/semesters/${semesterId}`);
    console.log("Semester deleted successfully:", response.data);
    return response.data;
  }


    catch (error) {
    console.error("Error deleting semester:", error);   
    throw error.response?.data || { message: 'Network error' };
    }   
};

export const setCurrentSemester = async (semesterId) => {
  try {
    console.log("Setting current semester:", semesterId);
    const response = await api.put(`/api/semesters/${semesterId}/set-current`);
    console.log("Current semester set successfully:", response.data);
    return response.data;
    } catch (error) {

    console.error("Error setting current semester:", error);
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchSemesterById = async (semesterId) => {

    try {
    console.log("Fetching semester by ID:", semesterId);
    const response = await api.get(`/api/semesters/${semesterId}`);
    console.log("Semester fetched successfully:", response.data);
    return response.data;
    }
    catch (error) {
    console.error("Error fetching semester by ID:", error);
    throw error.response?.data || { message: 'Network error' };
  }
};

