//các interface cần thiết
export interface LoginRequest{
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string,
}

export interface ApiResponse<T = unknown, D = null> {
  status: 'success' | 'error';
  message: T;
  data: D;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
    id: string;
    username: string;
    email: string;
    email_verified_at: string | null;
    role: "admin" | "user";
    created_at: string;
    updated_at: string;
  }





//raprap
export interface Theatre {
  id: string;
  name: string; // Tên rạp
  address: string; // Địa chỉ
  city: string; // Thành phố
  screen: string[]; // Mảng ObjectId của Screen
  createAt?: Date; // optional
  updateAt?: Date; // optional
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthApiResponse<T> {
  status: "success" | "error"; // Trạng thái phản hồi
  message: string; // Thông báo từ API
  data: T; // Dữ liệu trả về (tùy thuộc vào API)
}



