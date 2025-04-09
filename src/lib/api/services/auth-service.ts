import Cookies from 'js-cookie'
import { API_ENDPOINTS } from "../endpoints";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import axiosInstance from "../axios-instance";

export interface AuthApiResponse<T> {
    status: "success" | "error";
    message: string;
    data: T;
}
//luu thong tin user vao localStorage
const setUserAuthenticated = (token: string, user: User) => {
    localStorage.setItem("accessToken", token);
    Cookies.set('user-role', user.role || 'user', { expires: 7, path: '/' });
};
//xoa thong tin user khoi localStorage
const clearUserAuthentication = () => {
    localStorage.removeItem("accessToken");
    Cookies.remove('user-role', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
  };
  
  let isMakingAuthRequest = false;

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      const { accessToken } = response.data.data;
      const user = response.data.data.user;
      
      setUserAuthenticated(accessToken, user);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  

  

  logout: async (): Promise<AuthApiResponse<null>> => {
    if (isMakingAuthRequest) {
      console.log("Auth Service - Ignoring duplicate logout request");
      return {
        status: "success",
        message: "Already logging out",
        data: null
      };
    }
    
    isMakingAuthRequest = true;
    
    try {
      console.log("Auth Service - Logout request sent");
      const response = await axiosInstance.post<AuthApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
      console.log("Auth Service - Logout response:", response.data);
      
      clearUserAuthentication();
      
      return response.data;
    } catch (error) {
      console.error("Auth Service - Logout error:", error);
      throw error;
    } finally {
      setTimeout(() => {
        isMakingAuthRequest = false;
      }, 300);
    }
  },

 
  
};

export default authService;