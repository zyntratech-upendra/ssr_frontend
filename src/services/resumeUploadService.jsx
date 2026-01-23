import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================== FOLDER SERVICES ================== //

// Get all folders
export const getFolders = async () => {
  try {
    const response = await api.get(`/api/folders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Create folder
export const createFolder = async (name) => {
  try {
    const response = await api.post(`/api/folders`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Update folder name
export const renameFolder = async (id, name) => {
  try {
    const response = await api.put(`/api/folders/${id}`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Delete folder
export const deleteFolder = async (id) => {
  try {
    const response = await api.delete(`/api/folders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};



export const getResumesByFolder = async (folderId) => {
  try {
    const response = await api.get(`/api/resumes/folder/${folderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Upload resume
export const uploadResume = async (file, folderId) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("folderId", folderId);

    const response = await api.post(`/api/resumes/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Replace existing resume
export const replaceResume = async (resumeId, file) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await api.put(`/api/resumes/${resumeId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Delete resume
export const deleteResume = async (resumeId) => {
  try {
    const response = await api.delete(`/api/resumes/${resumeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

// Download resume (browser opens)
export const downloadResume = (resumeId) => {
  window.open(`${API_URL}/api/resumes/download/${resumeId}`, "_blank");
};

// Preview resume
export const previewResume = (fileName) => {
  window.open(`${API_URL}/uploads/resumes/${fileName}`, "_blank");
};

