import { apiClient } from './api.js';

export const timetableService = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/timetable', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/timetable/${id}`);
  },

  getByBatchSection: async (batchId, section) => {
    return await apiClient.get(`/timetable/batch/${batchId}/section/${section}`);
  },

  getByTeacher: async (teacherId) => {
    return await apiClient.get(`/timetable/teacher/${teacherId}`);
  },

  create: async (timetableData) => {
    return await apiClient.post('/timetable', timetableData);
  },

  update: async (id, timetableData) => {
    return await apiClient.put(`/timetable/${id}`, timetableData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/timetable/${id}`);
  }
};
