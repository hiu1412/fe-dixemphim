import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

console.log("Khởi tạo Axios với URL:", API_URL);

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    //gui va nhan cookie tu backend
    withCredentials: true,
});

//endpoint khong can refresh tokentoken
const NO_REFRESH_ENDPOINTS = [
    "auth/login",
    "auth/register",
    "auth/refresh",
];

//log cac request
axiosInstance.interceptors.request.use(
    (config) =>{
        console.log("Request: ", {
            method: config.method,
            url: config.url,
            headers: config.headers,
            data: config.data,
            withCredentials: config.withCredentials,
        });

        //them accessTToken tu localStorage vào Authorization header
        const token = localStorage.getItem("accessToken");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error)=>{
        console.error("Request Error: ", error);
        return Promise.reject(error);
    }
);

//kiem tra refresh token co dang duoc thuc hien hay khonkhon
let isRefreshing = false;

//resolve duoc goi khi refresh token thanh cong va lay token moi, cho phep cac yeu cau trong hang doi tiep tuc
//reject tu choi neu co loi xay ra
interface QueuePromise{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}

//mang chua cac phuong thuc resolve va reject, chua cac yeu cau bi loi nhu 401 can refresh tokentoken
let failedQueue: QueuePromise[] = [];

//ham nay duoc goi khi refresh token thanh cong hoac that bai
const processQueue = (error: unknown | null, token: string | null = null)=>{
    failedQueue.forEach(prom => {
        if(error){
            prom.reject(error);
        }else{
            prom.resolve(token);
        }
    });
    //xu ly xong thi lam rong cho lan xu ly tiep theo
    failedQueue = [];
};

//log cac response
axiosInstance.interceptors.response.use(
    (response) => {//thong tin phan hoi
      console.log("Response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });
      return response;
    },
    async (error) => {//xu ly loi cua phan hoihoi
      console.error("Response Error:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        } : null,
        request: error.request,
        config: error.config,
      });


      //kiemt ra endpoint loi va co nen quyet dinh refresh token khong
      const originalRequest = error.config;//yeu cau api ban dau, neu loi thi khi refresh token xong có thể gửi lại yêu cầu này
      const currentEndpoint = originalRequest.url?.replace(API_URL, '') || ''; //kiemt ra xem co nam trong ham bo qua refresh token khongkhong
      const shouldSkipRefresh = NO_REFRESH_ENDPOINTS.some(endpoint => 
        currentEndpoint.includes(endpoint)
      );
      //originalRequest._retry ngan ngua vong lap vo han
      //!shouldSkipRefresh: khong can refresh token thì skipskip
      if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
        console.log("Bắt đầu refresh token flow");//tra ve 401 la token khong hop lele
        
        
        if (isRefreshing) {
          console.log("Đã có request refresh token đang xử lý, thêm vào hàng đợi");
          // Nếu đang refresh token, thêm request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {//thanh cong thi gui lai request voi token moi duoc cap
              console.log("Tiếp tục request sau khi refresh token thành công");
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              console.error("Request bị reject sau khi refresh token thất bại", err);
              return Promise.reject(err);
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        console.log("Bắt đầu gọi API refresh token");
  
        try {
          // Dùng axios nguyên bản thay vì instance đã cấu hình để tránh lặp vô tận
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
            withCredentials: true,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            }
          });
          
          console.log("Refresh token thành công:", response.data);
          const { accessToken } = response.data.data;
  
          localStorage.setItem("accessToken", accessToken);
          //luu vao localStorage để dùng
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          //giai phong cac yeu cau trong hang doi sau khi refresh thanh cong    
          processQueue(null, accessToken);
          isRefreshing = false;
          
          return axiosInstance(originalRequest);//
        } catch (refreshError) {
          console.error("Refresh token thất bại:", refreshError);
          processQueue(refreshError, null);
          isRefreshing = false;
          
          localStorage.removeItem("accessToken");
          
          // Nếu không phải đang ở trang đăng nhập, chuyển hướng đến trang đăng nhập
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            window.location.href = "/auth/login";
          }
          
          return Promise.reject(error);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;