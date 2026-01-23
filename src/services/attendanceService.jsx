import axios from 'axios';

// Import the getToken function from your auth service
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const fetchDepartment = async () => {
  try {
    const response = await api.get('/api/departments'); 
    return response.data;}
   catch (error) {
    throw error.response?.data || { message: 'Network error' };
  } 
}


export const fetchBatchesByDepartmentId = async (departmentId) => {
  try {
    const response = await api.get(`/api/batches?department=${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchSubjectsByDepartmentId = async (departmentId) => {
  try {
    const response = await api.get(`/api/subjects?department=${departmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchTeacherTimetableId = async (teacherId) => {
  try {
    const response = await api.get(`/api/timetable/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export const fetchStudentbyBatchandSection = async (batchId, section) => {
  try {
    const response = await api.get(`/api/user?role=student&batch=${batchId}&section=${section}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


// Fetch attendance report for a given batch and section with optional query params
// filters: { batch, section, subject?, startDate?, endDate? }
export const fetchAttendanceReport = async (filters = {}) => {
  try {
    if (!filters.batch || !filters.section) {
      throw { message: 'batch and section are required' };
    }

    let url = `/api/attendance/report/batch/${encodeURIComponent(filters.batch)}/section/${encodeURIComponent(filters.section)}`;
    const params = new URLSearchParams();

    if (filters.subject) params.append('subject', filters.subject);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    if (query) url += `?${query}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Network error' };
  }
};


export const attendenceofStudents = async (attendanceData) => {
  try {
    const response = await api.post('api/attendance',attendanceData);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const fetchStudentInformation = async (studentId) => {
  try {
    const response = await api.get(`/api/user/${studentId}`);  
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }   

};



export const fetchStudentAttendance = async (studentId, filters = {}) => {
  try {
    if (!studentId) {
      throw { message: 'studentId is required' };
    }

    let url = `/api/attendance/student/${encodeURIComponent(studentId)}`;
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    if (query) url += `?${query}`;

    const response = await api.get(url);
    return response.data; // same as first function
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Network error' };
  }
};






export default api