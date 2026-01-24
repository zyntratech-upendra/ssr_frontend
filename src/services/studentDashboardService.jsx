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

// Get student profile
export const getStudentProfile = async (userId) => {
  try {
    const response = await api.get(`/api/student/user/${userId}`);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return {};
  }
};

// Get all courses (student's enrolled courses)
export const getStudentCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Get attendance records for student
export const getStudentAttendance = async (studentId) => {
  try {
    const response = await api.get(`/api/attendance/student/${studentId}`);
    const attendanceRecords = response.data?.data || [];
    
    // Calculate attendance percentage
    if (attendanceRecords.length === 0) return 0;
    
    const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
    const percentage = Math.round((presentCount / attendanceRecords.length) * 100);
    return percentage;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return 0;
  }
};

// Get student timetable
export const getStudentTimetable = async (batchId, section) => {
  try {
    if (!batchId || !section) {
      return [];
    }
    const response = await api.get(`/api/timetables/batch/${batchId}/section/${section}`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
};

// Get student dashboard statistics
export const getStudentDashboardStats = async (userId) => {
  try {
    // Get student profile
    const studentProfile = await getStudentProfile(userId);
    
    // Get courses
    const courses = await getStudentCourses();
    
    // Get attendance
    const attendance = await getStudentAttendance(studentProfile._id || userId);
    
    // Get timetable
    let timetable = [];
    if (studentProfile.batch && studentProfile.section) {
      timetable = await getStudentTimetable(studentProfile.batch, studentProfile.section);
    }

    console.log('Student Profile:', studentProfile);
    console.log('Courses:', courses);
    console.log('Attendance:', attendance);
    console.log('Timetable:', timetable);

    // Calculate stats
    const enrolledCourses = courses.length;
    const attendancePercentage = attendance;
    const gpa = studentProfile.cgpa || 0;

    return {
      enrolledCourses: enrolledCourses || 0,
      attendance: attendancePercentage,
      assignments: 0, // TODO: Calculate from submissions
      gpa: gpa,
      courses: courses,
      studentProfile: studentProfile,
    };
  } catch (error) {
    console.error('Error fetching student dashboard stats:', error);
    return {
      enrolledCourses: 0,
      attendance: 0,
      assignments: 0,
      gpa: 0,
      courses: [],
      studentProfile: {},
    };
  }
};
