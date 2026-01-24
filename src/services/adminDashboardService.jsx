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

// Get all users with pagination and role filtering
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/api/user', { params });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get all departments
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Fetch all users (without limit) to get accurate count
    const usersResponse = await api.get('/api/user');
    const users = usersResponse.data?.data || [];
    
    const departmentsResponse = await api.get('/api/departments');
    const departments = departmentsResponse.data?.data || [];
    
    const coursesResponse = await api.get('/api/courses');
    const courses = coursesResponse.data?.data || [];

    return {
      totalUsers: users.length,
      totalDepartments: departments.length,
      totalCourses: courses.length,
      pendingReports: 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      totalDepartments: 0,
      totalCourses: 0,
      pendingReports: 0,
    };
  }
};
