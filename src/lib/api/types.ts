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

  //moviemovie
  export interface Movie {
    id: string;
    title: string;
    description: string;
    duration: number;
    poster?: string; // optional
    director: string;
    rating: number;
    showtime: Showtime[]; // mảng các đối tượng Showtime
    createAt?: Date; // optional, default: Date.now
    updateAt?: Date; // optional, default: Date.now
}

export interface MovieListResponse {
  movies: Movie[];
}

//showtime
export interface Showtime {
  movie: string; // ObjectId của Movie
  screen: string; // ObjectId của Screen
  startTime: Date; // Thời gian bắt đầu
  endTime: Date; // Thời gian kết thúc
  price: number; // Giá vé
  createAt?: Date; // optional
  updateAt?: Date; // optional
}

//screen
export interface Screen {
  name: string; // Tên phòng chiếu
  type: string; // Loại phòng chiếu
  capacity: number; // Sức chứa của phòng chiếu
  createAt?: Date; // optional
  updateAt?: Date; // optional
}

//ghe
export interface Seat {
  screen: string; // ObjectId của Screen
  row: string; // Hàng ghế
  number: number; // Số ghế
  type: "normal" | "vip"; // Loại ghế
  isAvailable: boolean; // Trạng thái ghế
  createAt?: Date; // optional
  updateAt?: Date; // optional
}

//raprap
export interface Theatre {
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
