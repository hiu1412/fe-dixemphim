//LUU VÀ XÓA THÔNG TIN KHỎI LOCALSTORAGE VÀ COOKIES
//ISMAKINGAUTHREQUEST ĐỂ KIỂM TRA XEM CÓ YÊU CẦU XÁC THỰC NÀO ĐANG DIỄN RA HAY KHÔNG
//LOGIN REGISTER LOGOUT GETME

import Cookies from "js-cookie";
import { API_ENDPOINTS } from "../endpoints";
import { axiosInstance } from "../axios-instance";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";


export interface AuthApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

//Luuu thong tin vao localStorage va cookie
const setUserAuthenticated = (refreshToken: string, user: User) => {
  if (!user) {
    console.error("User object is undefined");
    return;
  }

  // Lưu tokens vào cookies để middleware có thể truy cập
  Cookies.set("refresh_token", refreshToken, { expires: 30, path: "/" });
  Cookies.set("user-role", user?.role || "user", { expires: 30, path: "/" });

  // Lưu accessToken vào localStorage để client có thể sử dụng
};

//xoa thong tin xac thuc
const clearUserAuthentication = () => {
  // Xóa từ localStorage


  // Xóa từ cookies
  
  Cookies.remove("refresh_token", { path: "/" });
  Cookies.remove("user-role", { path: "/" });
};

// Biến cờ để kiểm tra xem có yêu cầu xác thực đang diễn ra hay không
let isMakingAuthRequest = false;

const authService = {
  //DANG NHAP
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);

      if (!response.data) {
        throw new Error("Invalid response data");
      }

      const { accessToken, refreshToken, user } = response.data.data;

      // Kiểm tra dữ liệu nhận được
      if (!accessToken || !refreshToken || !user) {
        console.error("Missing auth data:", { accessToken, refreshToken, user });
        throw new Error("Missing required authentication data");
      }

      // Lưu thông tin xác thực
      if (user  && refreshToken) {
        setUserAuthenticated( refreshToken, user);
      } else {
        throw new Error("Missing required authentication data");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //Đăng ký 
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  //Đăng xuất
  logout: async (): Promise<AuthApiResponse<null>> => {
    //kiem tra xem co yeu cau nao dang dien ra hay khong
    //yeu cau dang xuat dang dien ra
    if (isMakingAuthRequest) {
      console.log("Auth Service - Logout: Another request is in progress. Please wait.");
      return {
        status: "success",
        message: "Already loggin out",
        data: null,
      };
    }
    isMakingAuthRequest = true;

    //gui yeu cau dang xuat den server
    try {
      console.log("Auth Service - Logout: Logging out...");
      const response = await axiosInstance.post<AuthApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
      console.log("Auth Service - Logout: Logout successful", response.data);

      //xóa thông tin xác thực
      clearUserAuthentication();
      return response.data;
    } catch (error) {
      console.error("Auth Service - Logout: Logout failed", error);
      throw error;
    } finally {
      setTimeout(() => {
        isMakingAuthRequest = false;
      }, 300);
    }
  },

  //lấy thông tin người dùng hiện tại
  getMe: async (): Promise<AuthResponse> => {
    if (isMakingAuthRequest) {
      console.log("Another request is in progress");
      throw new Error("Another request is in progress");
    }

    isMakingAuthRequest = true;

    try {
      const response = await axiosInstance.get<AuthResponse>(API_ENDPOINTS.AUTH.ME);

      if (!response.data) {
        throw new Error("Invalid response data");
      }

      const { user } = response.data.data;

      if (!user) {
        throw new Error("User data not found");
      }

      // Cập nhật vai trò người dùng trong cookie
      Cookies.set("user-role", user.role || "user", { expires: 7, path: "/" });

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        isMakingAuthRequest = false;
      }, 300);
    }
  },

  validateAdmin: async (): Promise<AuthApiResponse<{ isAdmin: boolean; user?: User }>> => {
    try {
      const response = await axiosInstance.get<AuthApiResponse<{ user: User }>>(API_ENDPOINTS.AUTH.ME);

      const isAdmin = response.data.data.user?.role === 'admin';

      return {
        status: response.data.status,
        message: response.data.message,
        data: {
          isAdmin,
          user: response.data.data.user
        }
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to validate admin rights",
        data: { isAdmin: false }
      };
    }
  },


  //login google
  loginWithGoogle: (): void => {
    // Chuyển hướng người dùng đến backend để xử lý Google OAuth
    window.location.href = 'http://localhost:4000/auth/google';
  },


  handleGoogleCallback: async (): Promise<AuthApiResponse<{ user: null, access_token: null }>> => {
    return {
      status: "success",
      message: "Please use the success route instead",
      data: { user: null, access_token: null }
    };
  },

  requestEmail: async(email:string): Promise<AuthApiResponse<null>> => {
    try{
      const response = await axiosInstance.post<AuthApiResponse<null>>(API_ENDPOINTS.AUTH.EMAIL_REQUEST, { email });
      return response.data;
    }catch(error){
      console.error("Error requesting password reset:", error);
      throw error;
    }
  },

  resetPasswordEmail: async (token: string, newPassword: string): Promise<AuthApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<AuthApiResponse<null>>(
        API_ENDPOINTS.AUTH.EMAIL_RESET(token),
        { newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("Auth Service - Reset Password: Failed", error);
      throw error;
    }
  },
};

export default authService;

