import axios from "axios";

export const deleteNotification = async (notificationId) => {
  return axios.delete(`/notifications/delete${notificationId}`);
};

export const getUserNotification = async (userId) => {
  return axios.get(`/notifications/user-notifications/${userId}`);
};

export const notification = async () => {
  return axios.get("notifications/all-notifications");
};
