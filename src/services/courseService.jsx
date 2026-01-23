import api from './authService';

export const getAllCourses = async () => {
  try {
    const res = await api.get('/api/courses');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching courses', err);
    return [];
  }
};

export const createCourse = async (courseData) => {
  try {
    const res = await api.post('/api/courses', courseData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Network error' };
  }
};

export default { getAllCourses, createCourse };
