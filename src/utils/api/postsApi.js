import axios from "../service/axiosCustomize";

export const deletePost = async (postId) => {
  return await axios.delete(`/api/posts/${postId}`);
};

export const likePost = async (postId) => {
  return await axios.post(`/api/posts/like/${postId}`);
};

export const commentPost = async (postId) => {
  return await axios.post(`/api/posts/comment/${postId}`);
};

export const fetchAnyThing = async (POST_ENDPOINT) => {
  return await axios.post(POST_ENDPOINT);
};

export const createPost=async (formData)=>{
    return await axios.post("/api/posts/create", formData);
}