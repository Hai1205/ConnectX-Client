import axiosInstance from "../service/axiosInstance";

export const deleteNotificationById = async (notificationId) => {
  return axiosInstance.delete(`/api/notifications/delete-by-id/${notificationId}`);
};

export const deleteNotificationByUserId = async (userId) => {
  return axiosInstance.delete(`/api/notifications/delete-by-userid/${userId}`);
};

export const getUserNotification = async (userId) => {
  return axiosInstance.get(`/api/notifications/get-user-notifications/${userId}`);
};

export const notification = async () => {
  return axiosInstance.get("/api/notifications/get-all-notifications");
};
