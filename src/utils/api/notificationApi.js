import axios from "axios";

export const notification = async () => {
  return axios.get("/api/notifications");
};

export const deleteNotification = async () => { 
    return axios.delete("/api/notifications/delete");
}
