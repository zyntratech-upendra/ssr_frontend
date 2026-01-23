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


export const createSection = async (sectionData) => {
  try {
    console.log("Creating section:", sectionData);
    const response = await api.post('/api/sections', sectionData);
    console.log("Section created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating sections:", error);
    throw error.response?.data || { message: 'Network error' };
  }
};



export const  fetchSectionsbyDepartementandBatchandYear= async (departmentId,batchId,academicYear) => {
    console.log("service"+departmentId)
  try {
    const response = await api.get(`/api/sections/?department=${departmentId}&batch=${batchId}&academicYear=${academicYear}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchStudentsbyBatchandSection= async (batchId,sectionName) => {
  try {
    const response = await api.get(`/api/user?role=student&batch=${batchId}&section=${sectionName}`);   
    console.log(response.data)
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
}

export const  fetchSectionsandBatchandYear= async (batchId,academicYear) => {
  
  try {
    const response = await api.get(`/api/sections/?batch=${batchId}&academicYear=${academicYear}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};