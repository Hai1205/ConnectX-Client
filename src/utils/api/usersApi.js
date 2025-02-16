import axios from "../service/axiosCustomize";

export const followUser = async (currentUserId, userToModifyId) => {
  return await axios.post(`/users/follow/${currentUserId}`, null, {
    params: { userToModifyId },
  });
};

export const updateUser = async (userId, coverImg, profileImg, formData) => {
  const data = new FormData();

  if (coverImg) {
    data.append("coverImg", coverImg);
  }

  if (profileImg) {
    console.log(profileImg)
    data.append("profileImg", profileImg);
  }

  if (formData) {
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
  }

  return await axios.put(`/users/update/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const suggestedUser = async (userId) => {
  return await axios.get(`/users/suggested/${userId}`);
};

export const profileUser = async (userId) => {
  return await axios.get(`/users/profile/${userId}`);
};
