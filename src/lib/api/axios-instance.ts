import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//them token vao header va lay accesstoken tu localStorage 
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Giữ lại withCredentials cho các request thông thường
});

const NO_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token"
];

// Gắn token vào header cho mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Xử lý refresh token khi token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Không retry cho các endpoints liên quan đến auth
    if (NO_REFRESH_ENDPOINTS.some(endpoint => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error);
    }

    // Xử lý refresh token khi gặp lỗi 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Lấy refresh token từ cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as { [key: string]: string });

        const refreshToken = cookies['refresh_token'];
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {
            refreshToken
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          }
        );

        // Kiểm tra response và lấy access token mới
        const newAccessToken = response.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Invalid refresh token response");
        }

        localStorage.setItem("access_token", newAccessToken);

        // Cập nhật token cho request hiện tại và các request trong hàng đợi
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;