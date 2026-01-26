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


export const createFee = async (feeData) => {
  try {
    const response = await api.post('/api/fees/', feeData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};




export const fetchSemsterByDepartment = async (departmentId) => {
  console.log(departmentId)
  try {
    const response = await api.get(`/api/semesters?department=${departmentId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const handleFeeEdit=async (id,editData) => {
  try{
    const response = await api.put(`/api/fees/student/${id}`,editData);
    console.log(response.data)
    return response.data;
  }
  catch(error){
    throw error.response?.data || { message: 'Network error' }
}
};

export const handlesSaveDiscount = async (id, discountAmount) => {
  try {
    const response = await api.patch(`/api/fees/student/${id}/discount`, {
      discount: discountAmount
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};


export const fetchStudentFee = async () => {

  try {
    const response = await api.get(`/api/fees/students`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const getAllCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export const fetchDepartementsByCousresData = async (courseId) => {
  try {
    const response = await api.get(`/api/departments/course/${courseId}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};


export default api
