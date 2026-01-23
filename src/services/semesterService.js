import { apiClient } from './api.js';

export const semesterService = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/semesters', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/semesters/${id}`);
  },

  getCurrentByDepartment: async (departmentId) => {
    return await apiClient.get(`/semesters/current/${departmentId}`);
  },

  create: async (semesterData) => {
    return await apiClient.post('/semesters', semesterData);
  },

  update: async (id, semesterData) => {
    return await apiClient.put(`/semesters/${id}`, semesterData);
  },

  setAsCurrent: async (id) => {
    return await apiClient.put(`/semesters/${id}/set-current`, {});
  },

  delete: async (id) => {
    return await apiClient.delete(`/semesters/${id}`);
  }
};
