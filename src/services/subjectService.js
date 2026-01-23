import { apiClient } from './api.js';

export const subjectService = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/subjects', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/subjects/${id}`);
  },

  create: async (subjectData) => {
    return await apiClient.post('/subjects', subjectData);
  },

  update: async (id, subjectData) => {
    return await apiClient.put(`/subjects/${id}`, subjectData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/subjects/${id}`);
  },

  getByDepartmentAndYear: async (departmentId, year) => {
    return await apiClient.get('/subjects', { department: departmentId, year });
  }
};
