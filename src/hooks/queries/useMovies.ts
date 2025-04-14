import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios-instance';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse, Movie } from '@/lib/api/types';

export const MOVIES_QUERY_KEY = ['movies'] as const;

export const useMovies = () => {
  return useQuery({
    queryKey: MOVIES_QUERY_KEY,
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<Movie[]>>(API_ENDPOINTS.MOVIES.ALL);
      return response.data.data;
    },
  });
}; 