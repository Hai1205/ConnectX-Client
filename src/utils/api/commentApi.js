import axios from "../service/axiosCustomize.js";

export const createComemnt = async (postId, userID, text, img) => {
  const formData = new FormData();

  if (img) {
    formData.append("img", img);
  }

  if (text) {
    formData.append("text", text);
  }

  return axios.post(
    `/comments/create-comment/${postId}/${userID}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteComment = async (commentId) => {
  return axios.delete(`/comments/delete-comment/${commentId}`);
};

export const postComment = async (postId) => {
  return axios.get(`/comments/post-comments/${postId}`);
};

export const deletePostComment = async (postId) => {
  return axios.delete(`/comments/delete-post-comments/${postId}`);
};

export const updateComment = async (postId, commentId, text, img) => {
  const formData = new FormData();

  if (img) {
    formData.append("img", img);
  }

  if (text) {
    formData.append("text", text);
  }

  return axios.put(
    `/comments/update-comment/${postId}/${commentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
