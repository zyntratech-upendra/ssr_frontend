import { apiClient } from './api.js';

export const teacherAllocationService = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/teacher-allocations', filters);
  },

  getById: async (id) => {
    return await apiClient.get(`/teacher-allocations/${id}`);
  },

  getByTeacher: async (teacherId) => {
    return await apiClient.get(`/teacher-allocations/teacher/${teacherId}`);
  },

  create: async (allocationData) => {
    return await apiClient.post('/teacher-allocations', allocationData);
  },

  update: async (id, allocationData) => {
    return await apiClient.put(`/teacher-allocations/${id}`, allocationData);
  },

  delete: async (id) => {
    return await apiClient.delete(`/teacher-allocations/${id}`);
  },

  getByDepartmentBatchSection: async (departmentId, batchId, section) => {
    return await apiClient.get('/teacher-allocations', {
      department: departmentId,
      batch: batchId,
      section
    });
  }
};
