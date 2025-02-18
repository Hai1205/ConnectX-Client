import axios from "../service/axiosCustomize";

export const deleteNotificationById = async (notificationId) => {
  return axios.delete(`/notifications/delete-by-id/${notificationId}`);
};

export const deleteNotificationByUserId = async (userId) => {
  return axios.delete(`/notifications/delete-by-userid/${userId}`);
};

export const getUserNotification = async (userId) => {
  return axios.get(`/notifications/user-notifications/${userId}`);
};

export const notification = async () => {
  return axios.get("notifications/all-notifications");
};
