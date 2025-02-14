import axios from "../service/axiosCustomize";

export const followUser = async (userId) => {
  return await axios.post(`/api/users/follow/${userId}`);
};

export const updateUser = async (formData) => {
  return await axios.put("/api/users/update", formData);
};

export const suggestedUser = async () => {
  return await axios.get("/api/users/suggested");
};

export const profileUser = async (username) => {
  return await axios.get(`/api/users/profile/${username}`);
};
