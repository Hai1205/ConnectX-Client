import axiosInstance from "../service/axiosInstance";

export const deletePost = async (postId) => {
  return await axiosInstance.delete(`/api/posts/delete/${postId}`);
};

export const likePost = async (postId, userId) => {
  return await axiosInstance.post(`/api/posts/like/${postId}/${userId}`);
};

export const bookmarkPost = async (postId, userId) => {
  return await axiosInstance.post(`/api/posts/bookmark/${postId}/${userId}`);
};

export const sharePost = async (postId, userId) => {
  return await axiosInstance.post(`/api/posts/share/${postId}/${userId}`);
};

export const createPost = async (userId, photos, content) => {
  const formData = new FormData();

  if (photos && photos.length > 0) {
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });
  }

  if (content) {
    formData.append("content", content);
  }

  return await axiosInstance.post(`/api/posts/create/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllPosts = async () => {
  return await axiosInstance.get("/api/posts/get-all-posts");
};

export const getFollowingPosts = async (userId) => {
  return await axiosInstance.get(`/api/posts/get-following-posts/${userId}`);
};

export const getUserPosts = async (userId) => {
  return await axiosInstance.get(`/api/posts/get-user-posts/${userId}`);
};

export const getLikedPosts = async (userId) => {
  return await axiosInstance.get(`/api/posts/get-liked-posts/${userId}`);
};

export const getBookmarkedPosts = async (userId) => {
  return await axiosInstance.get(`/api/posts/get-bookmarked-posts/${userId}`);
};
