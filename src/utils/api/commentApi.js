import axiosInstance from "../service/axiosInstance.js";

export const createComemnt = async (postId, userID, content, img) => {
  const formData = new FormData();

  if (img) {
    formData.append("img", img);
  }

  if (content) {
    formData.append("content", content);
  }

  return axiosInstance.post(`/api/comments/create-comment/${postId}/${userID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteComment = async (commentId) => {
  return axiosInstance.delete(`/api/comments/delete-comment/${commentId}`);
};

export const postComment = async (postId) => {
  return axiosInstance.get(`/api/comments/get-post-comments/${postId}`);
};

export const deletePostComment = async (postId) => {
  return axiosInstance.delete(`/api/comments/delete-post-comments/${postId}`);
};

export const updateComment = async (postId, commentId, content, img) => {
  const formData = new FormData();

  if (img) {
    formData.append("img", img);
  }

  if (content) {
    formData.append("content", content);
  }

  return axiosInstance.put(
    `/api/comments/update-comment/${postId}/${commentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
