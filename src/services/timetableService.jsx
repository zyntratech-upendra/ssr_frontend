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


export const  fetchBatchesByDepartment= async (departmentId) => {
    console.log(departmentId)
  try {
    const response = await api.get(`/api/batches/department?departmentId=${departmentId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const  fetchTeacherandSubjectAllocations= async (departmentId,batchId,section) => {
  console.log(departmentId,batchId,section)
  try {
    const response = await api.get(`api/teacher-allocations?department=${departmentId}&batch=${batchId}&section=${section}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const fetchTimetablebyBatchandSection = async (batchId, section) => {
  console.log(batchId, section);
  try {
    const response = await api.get(`api/timetable/batch/${batchId}/section/${section}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};




export const createTimetable = async (timetableData) => {
  try {
    console.log("Creating timetable:", timetableData);
    const response = await api.post('/api/timetable', timetableData);
    console.log("Timetable created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating timetable:", error);
    throw error.response?.data || { message: 'Network error' };
  }
};

export const teacherClasses = async (teacherId,departmentId,batchId,academicYear) => {
  try {
    const response = await api.get(`/api/timetable?teacher=${teacherId}&department=${departmentId}&batch=${batchId}&academicYear=${academicYear}`);  
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  } 
}

export default api; 

