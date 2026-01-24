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

// Get all courses for the logged-in teacher
export const getTeacherCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return [];
  }
};

// Get teacher timetable
export const getTeacherTimetable = async (teacherId) => {
  try {
    const response = await api.get(`/api/timetables/teacher/${teacherId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    return [];
  }
};

// Get all users (students) for filtering
export const getStudents = async () => {
  try {
    const response = await api.get('/api/user', { params: { role: 'student' } });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Get teacher allocations to see how many students per course
export const getTeacherAllocations = async (teacherId) => {
  try {
    const response = await api.get(`/api/teacher-allocations/teacher/${teacherId}`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching teacher allocations:', error);
    return [];
  }
};

// Get teacher dashboard statistics
export const getTeacherDashboardStats = async (teacherId) => {
  try {
    const [courses, timetable, students, allocations] = await Promise.all([
      getTeacherCourses(),
      getTeacherTimetable(teacherId),
      getStudents(),
      getTeacherAllocations(teacherId),
    ]);

    console.log('Courses:', courses);
    console.log('Timetable:', timetable);
    console.log('Allocations:', allocations);

    // Get today's day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = daysOfWeek[new Date().getDay()];
    
    // Get today's classes from timetable
    const todayClasses = timetable.filter(t => t.dayOfWeek === today) || [];

    // Calculate total students from allocations
    const totalStudents = new Set(
      allocations.flatMap(a => a.batch?._id || a.batch || [])
    ).size * 30; // Assuming ~30 students per batch (adjust as needed)

    // Or count unique batches and sections
    const uniqueBatches = new Set(allocations.map(a => `${a.batch?._id || a.batch}-${a.section}`)).size;
    const estimatedStudents = uniqueBatches * 35; // Approximate students

    return {
      myClasses: courses.length,
      totalStudents: estimatedStudents || 0,
      pendingGrades: 0, // TODO: Calculate from submissions/assignments
      todayClasses: todayClasses.length,
      courses: courses,
      timetable: timetable,
      allocations: allocations,
    };
  } catch (error) {
    console.error('Error fetching teacher dashboard stats:', error);
    return {
      myClasses: 0,
      totalStudents: 0,
      pendingGrades: 0,
      todayClasses: 0,
      courses: [],
      timetable: [],
      allocations: [],
    };
  }
};
