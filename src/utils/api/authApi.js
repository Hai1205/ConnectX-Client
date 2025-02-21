import axiosInstance from "../service/axiosInstance.js";

export const registerUser = async (formData) => {
  return await axiosInstance.post("/api/auth/register", formData);
};

export const loginUser = async (formData) => {
  return await axiosInstance.post("/api/auth/login", formData);
};

export const logoutUser = async () => {
  return await axiosInstance.post("/api/auth/logout");
};
