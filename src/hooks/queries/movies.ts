import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Movie, ApiResponse } from "@/lib/api/types";
import axiosInstance from "@/lib/api/axios-instance";

export const MOVIE_QUERY_KEYS = {
  all: ["movies"] as const,
  lists: () => [...MOVIE_QUERY_KEYS.all, "list"] as const,
  detail: (id: string) => [...MOVIE_QUERY_KEYS.all, "detail", id] as const,
  newest: () => [...MOVIE_QUERY_KEYS.all, "newest"] as const,
};

// Lấy danh sách phim
export const useMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<string, { movies: Movie[] }>>(
        API_ENDPOINTS.MOVIES.BASE
      );
      return response.data.data;
    },
  });
};

// Lấy chi tiết 1 phim
export const useMovie = (id: string) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<string, { movie: Movie }>>(
        API_ENDPOINTS.MOVIES.DETAIL(id)
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Lấy danh sách phim mới nhất
export const useNewestMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.newest(),
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<string, { movies: Movie[] }>>(
        API_ENDPOINTS.MOVIES.NEWEST
      );
      return response.data.data;
    },
  });
};