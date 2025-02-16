import axios from "../service/axiosCustomize.js";

export const registerUser = async (formData) => {
  console.log(formData);
  return await axios.post("/auth/register", formData);
};

export const loginUser = async (formData) => {
  return await axios.post("/auth/login", formData);
};

export const logoutUser = async () => {
  return await axios.post("/auth/logout");
};

export const me = async () => {
  return await axios.get("/auth/me");
};
