import axios from "../service/axiosCustomize";

export const deletePost = async (postId) => {
  return await axios.delete(`/posts/${postId}`);
};

export const likePost = async (userId, postId) => {
  return await axios.post(`/posts/like/${userId}/${postId}`);
};

export const createPost = async (userId, photos, text) => {
  const formData = new FormData();
  
  if (photos && photos.length > 0) {
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });
  }

  if (text) {
    formData.append("text", text);
  }

  return await axios.post(`/posts/create/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllPosts = async () => {
  return await axios.get("/posts/all-posts");
};

export const getFollowingPosts = async (userId) => {
  return await axios.get(`/posts/following-posts/${userId}`);
}

export const getUserPosts = async (userId) => {
  return await axios.get(`/posts/user-posts/${userId}`);
}

export const getLikedPosts = async (userId) => {
  return await axios.get(`/posts/liked-posts/${userId}`);
}