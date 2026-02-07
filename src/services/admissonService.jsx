import axios from "axios";
import { getToken } from "./authService"; // Optional if you use authentication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   APPLICATION CREATION
============================================================ */

export const submitApplication = async (applicationData) => {
  try {
    const response = await api.post("/api/applications", applicationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error while submitting" };
  }
};

/* ============================================================
   GET ALL APPLICATIONS (Admin view)
============================================================ */

export const getAllApplications = async () => {
  try {
    const response = await api.get("/api/applications");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Unable to fetch applications" };
  }
};

/* ============================================================
   GET APPLICATION BY DATABASE ID
============================================================ */

export const getApplicationById = async (id) => {
  try {
    console.log(id);
    const response = await api.get(`/api/applications/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Application not found" };
  }
};

/* ============================================================
   GET APPLICATION SUMMARY BY applicationId
============================================================ */

export const getApplicationSummary = async (applicationId) => {
  try {
    const response = await api.get(`/api/applications/summary/${applicationId}`);
    return response.data;
    
  } catch (error) {
    throw error.response?.data || { message: "Summary fetch failed" };
  }
};

/* ============================================================
   UPDATE OFFICE USE ONLY DATA
============================================================ */

export const updateOfficeUseOnly = async (applicationId, officeUseData) => {
  try {
    const response = await api.post(
      `/api/applications/office-use/${applicationId}`,
      officeUseData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Office use update failed" };
  }
};

/* ============================================================
   UPLOAD SINGLE FILE
============================================================ */

export const uploadSingleFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // return file object as response.file
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "File upload failed" };
  }
};

/* ============================================================
   UPLOAD MULTIPLE FILES
============================================================ */

export const uploadMultipleFiles = async (filesArray) => {
  try {
    const formData = new FormData();

    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/api/files/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Multiple file upload failed" };
  }
};

/* ============================================================
   DRAFT MANAGEMENT
============================================================ */

export const getSavedDrafts = async () => {
  try {
    const response = await api.get('/api/drafts/user');
    return response.data ? response.data : response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch drafts' };
  }
};

export const getDraftById = async (draftId) => {
  try {
    const response = await api.get(`/api/drafts/${draftId}`);
    return response.data ? response.data : response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch draft' };
  }
};

export const saveDraft = async (draftData, draftId = null) => {
  try {
    const payload = {
      draftData,
      status: 'draft',
    };

    if (draftId) {
      const response = await api.put(`/api/drafts/${draftId}`, payload);
      return response.data ? response.data : response;
    } else {
      const response = await api.post('/api/drafts', payload);
      return response.data ? response.data : response;
    }
  } catch (error) {
    throw error.response?.data || { message: 'Failed to save draft' };
  }
};

export const deleteDraft = async (draftId) => {
  try {
    const response = await api.delete(`/api/drafts/${draftId}`);
    return response.data ? response.data : response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete draft' };
  }
};

/* ============================================================
   LOCAL STORAGE DRAFT UTILITIES
============================================================ */

export const saveLocalDraft = (draftData, key = 'admission_draft') => {
  try {
    const backup = {
      data: draftData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(backup));
    return true;
  } catch (error) {
    console.error('Local storage save error:', error);
    return false;
  }
};

export const getLocalDraft = (key = 'admission_draft') => {
  try {
    const backup = localStorage.getItem(key);
    return backup ? JSON.parse(backup) : null;
  } catch (error) {
    console.error('Local storage read error:', error);
    return null;
  }
};

export const clearLocalDraft = (key = 'admission_draft') => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Local storage clear error:', error);
    return false;
  }
};

export default api;
