// src/services/uploadGallery.js
import axios from "axios";

const base = import.meta.env.VITE_API_URL ;

const uploadGallery = axios.create({
  baseURL: base + "/api",
  // you can set other defaults here
});

// Attach token if present. Do NOT set Content-Type for FormData here.
uploadGallery.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default uploadGallery;
