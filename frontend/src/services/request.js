import LocalStorage from "./localStorage";
import axios from "axios";
import { createToast } from "mosha-vue-toastify";
import router from "../router/Router";
import { useRouter } from "vue-router";

function setToast(message, type) {
  createToast(message, {
    position: "top-right",
    timeout: 5000,
    close: true,
    type: type,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

request.interceptors.request.use((config) => {
  const token = LocalStorage.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("app-token");
    localStorage.removeItem("app-user");
    router.push({ name: "Login" });
    window.location.reload();
  }

  return config;
});

export default request;

export const make = async (method, url, data) => {
  const config = {
    method,
    url,
    data,
  };
  return await request(config);
};
