import { apiClient } from './api.js';

export const sectionService = {
  create: async (sectionData) => {
    return await apiClient.post('/sections', sectionData);
  },

  createMultiple: async (sectionData) => {
    return await apiClient.post('/sections/bulk/create', sectionData);
  },

  getAll: async (filters = {}) => {
    return await apiClient.get('/sections', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/sections/${id}`);
  },

  getByBatch: async (batchId, filters = {}) => {
    return await apiClient.get(`/sections/batch/${batchId}`, filters);
  },

  update: async (id, sectionData) => {
    return await apiClient.put(`/sections/${id}`, sectionData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/sections/${id}`);
  }
};
