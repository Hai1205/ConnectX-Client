import axios from "axios";
import NProgress from "nprogress";

// Cấu hình NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

// Hàm lấy JWT token từ cookies
const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return matches ? matches[2] : null;
};

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

// Hàm lấy JWT từ cookies, localStorage hoặc sessionStorage
const getToken = (item) => {
  return getCookie(item) || 
         localStorage.getItem(item) || 
         sessionStorage.getItem(item);
};

// Thêm request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    NProgress.start();

    const token = getToken("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Thêm response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    NProgress.done();
    
    return response;
  },
  function (error) {
    NProgress.done();
    return error?.response?.data?.message
      ? error.response.data.message
      : Promise.reject(error);
  }
);

export default axiosInstance;
