import axios from "axios";

export const createComemnt = async (img, formData) => {
  return axios.post(
    "/comments/create-comments",
    { img, formData },
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

export const updateComment = async (commentId, formData, img) => {
  return axios.put(
    `/comments/update-comment/${commentId}`,
    { formData, img },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
