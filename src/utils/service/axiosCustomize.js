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
const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

// Thêm request interceptor
instance.interceptors.request.use(
  function (config) {
    NProgress.start();

    // Lấy token từ cookies
    const token = getCookie("JWT_TOKEN");
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
instance.interceptors.response.use(
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

export default instance;
