import { AxiosResponse } from 'axios';
import { API_ENDPOINTS } from "./endpoints";
import axiosInstance from './axios-instance';
import { Movie, User, AdminMovieResponse, AdminSingleMovieResponse } from './types';

interface AdminStats {
    total_movies: number;
}

interface Pagination {
    total: number;
    current_page: number;
    total_pages: number;
    limit: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}


// API endpoints cho Movie
export const adminApi = {
    // Lấy danh sách phim
    getMovies: (): Promise<AxiosResponse<AdminMovieResponse>> =>
        axiosInstance.get(API_ENDPOINTS.MOVIES.BASE),

    // Tạo phim mới
    createMovie: (data: FormData) =>
        axiosInstance.post<AdminSingleMovieResponse>(API_ENDPOINTS.MOVIES.CREATE, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    // Cập nhật phim
    updateMovie: (id: string, data: FormData): Promise<AxiosResponse<Movie>> =>
        axiosInstance.put(API_ENDPOINTS.MOVIES.UPDATE(id), data),

    deleteCar: (id: string) =>
        axiosInstance.delete<AdminSingleMovieResponse>(API_ENDPOINTS.MOVIES.DELETE(id)),

    // Lấy thống kê
    getStats: (): Promise<AxiosResponse<AdminStats>> =>
        axiosInstance.get('/admin/stats'),
};




