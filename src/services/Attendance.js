import { apiClient } from './api.js';

export const attendanceService = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/attendance', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/attendance/${id}`);
  },

  getByStudent: async (studentId, filters = {}) => {
    return await apiClient.get(`/attendance/student/${studentId}`, filters);
  },

  getBatchReport: async (batchId, section, filters = {}) => {
    return await apiClient.get(
      `/attendance/report/batch/${batchId}/section/${section}`,
      filters
    );
  },

  create: async (attendanceData) => {
    return await apiClient.post('/attendance', attendanceData);
  },

  update: async (id, attendanceData) => {
    return await apiClient.put(`/attendance/${id}`, attendanceData);
  },

  markAttendance: async (attendanceData) => {
    return await apiClient.post('/attendance', attendanceData);
  }
};
