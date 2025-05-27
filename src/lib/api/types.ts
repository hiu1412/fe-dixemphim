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
    _id: string;
    username: string;
    email: string;
    email_verified_at: string | null;
    role: "admin" | "user";
    active: boolean;
    created_at: string;
    updated_at: string;
  }

  //kiểu dữ liệu cần thiết gồm phân trang, tìm kiếm, sắp xếp
export interface BaseFilters {
  search?: string;    // Tìm kiếm theo tên/email
  page?: number;      // Số trang hiện tại
  limit?: number;     // Số người dùng trên mỗi trang
  sortBy?: string;    // Sắp xếp (ví dụ: "createAt:desc")
}
//đối với User
export interface UserFilters extends BaseFilters{
  role?: "admin" | "user" |  string;     // Vai trò (admin/user)
  active?: boolean;  // Trạng thái hoạt động
}

  export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  artists: (string | Artist)[]; 
  genres: string[];  
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  _id: string;
  name: string; 
  image: string; 
  description: string; 
  createAt?: Date;
  updateAt?: Date; 
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

//cart

export interface CartItem {
  product: string;
  price: number;
  quantity: number;
  productName: string,
  productImage: string;
}

export interface Cart{
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

//Order
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
}

export interface Order {
  _id?: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}


//api request và response
//request thêm vào giỏ hàng

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

//Request cập nhật giỏ hàng
export interface UpdateCartRequest{
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  // Có thể trống vì sẽ dùng giỏ hàng hiện tại của user
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CartResponse {
  success: boolean; // Hoặc status: "success" | "error" để khớp với API của bạn
  message?: string;
  data: Cart;
}

// Order response
export interface OrderResponse {
  success: boolean; // Hoặc status: "success" | "error" để khớp với API của bạn
  message?: string;
  data: Order;
}

export interface OrdersListResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

export interface SyncCartRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}