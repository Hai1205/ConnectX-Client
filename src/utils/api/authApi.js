import axios from "../service/axiosCustomize.js";

export const registerUser = async (formData) => {
  console.log(formData)
  return await axios.post("/api/auth/register", formData);
};

export const loginUser = async (formData) => {
  return await axios.post("/api/auth/login", formData);
};

export const logoutUser=async()=>{
  return await axios.post("/api/auth/logout");
}

export const me = async () => {
  return await axios.get("/api/auth/me");
};