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


export const fetchTeacherAllocations = async () => {
  try {
    const response = await api.get('/api/teacher-allocations'); 
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchSubjectsByDepartmentAndYear = async (departmentId, year) => {
  try {
    const response = await api.get(`/api/subjects?department=${departmentId}&year=${year}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const createTeacherAllocation = async (allocationData) => {
  try {
    console.log("Allocating teacher:", allocationData);
    const response = await api.post('/api/teacher-allocations', allocationData);
    console.log("Teacher allocated successfully:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error allocating teacher:", error);
    throw error.response?.data || { message: 'Network error' };
  }
};



export const updateTeacherAllocation = async (allocationId, allocationData) => {
  try {
    const response = await api.put(`/api/teacher-allocations/${allocationId}`, allocationData);
    return response.data;
  }
    catch (error) {
    throw error.response?.data || { message: 'Network error' };
    }
};

export const deleteTeacherAllocation = async (allocationId) => {
    try {   
        const response = await api.delete(`/api/teacher-allocations/${allocationId}`);  
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
  };





export const fetchTeachersByDepartment = async (departmentId) => {
  console.log(departmentId)
  try {
    const response = await api.get(`/api/admin/users?role=teacher&department=${departmentId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const fetchBatchesByDepartment = async (departmentId) => {
  console.log(departmentId)
  try {
    const response = await api.get(`/api/batches?department=${departmentId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchSectionsByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/api/sections?department=${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export default api;