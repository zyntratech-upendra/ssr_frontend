import axios from "axios";
import { getToken } from "./authService"; // Optional if you use authentication

const API_URL = import.meta.env.VITE_API_URL;

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

export default api;
