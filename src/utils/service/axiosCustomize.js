import axios from "axios";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    accept: "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    NProgress.start();
    
    // const token = localStorage.getItem("token");
    // if (token !== null) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    NProgress.done();
    
    return response;
  },
  function (error) {
    return error &&
      error.response &&
      error.response.data &&
      error.response.data.message
      ? error.response.data.message
      : Promise.reject(error);
  }
);

export default instance;
