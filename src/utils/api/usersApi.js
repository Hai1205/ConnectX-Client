import axiosInstance from "../service/axiosInstance";

export const followUser = async (currentUserId, userToModifyId) => {
  return await axiosInstance.post(`/api/users/follow/${currentUserId}/${userToModifyId}`);
};

export const updateUser = async (userId, coverImg, profileImg, formData) => {
  const data = new FormData();

  if (coverImg) {
    data.append("coverImg", coverImg);
  }

  if (profileImg) {
    console.log(profileImg);
    data.append("profileImg", profileImg);
  }

  if (formData) {
    data.append("formData", JSON.stringify(formData)); // Chuyển formData thành chuỗi JSON
  }

  return await axiosInstance.put(`/api/users/update/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const suggestedUser = async (userId) => {
  return await axiosInstance.get(`/api/users/get-user-suggested/${userId}`);
};

export const profileUser = async (userId) => {
  return await axiosInstance.get(`/api/users/get-profile/${userId}`);
};
