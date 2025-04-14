import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios-instance';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse, Movie } from '@/lib/api/types';

interface NewestMoviesResponse {
  movies: Movie[];
}

export const NEWEST_MOVIES_QUERY_KEY = ['movies', 'newest'] as const;

export const useNewestMovies = () => {
  return useQuery({
    queryKey: NEWEST_MOVIES_QUERY_KEY,
    queryFn: async () => {
      try {
        console.log('Calling API:', API_ENDPOINTS.MOVIES.NEWEST);
        const response = await axiosInstance.get<ApiResponse<NewestMoviesResponse>>(API_ENDPOINTS.MOVIES.NEWEST);
        
        // Log chi tiết response
        console.log('API Response:', {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data
        });
        
        // Kiểm tra cấu trúc data
        const responseData = response.data.data as NewestMoviesResponse | null;
        if (response.data.status === 'success' && responseData?.movies) {
          console.log('Movies extracted:', responseData.movies);
        }
        
        return response.data;
      } catch (error) {
        console.error('Error fetching newest movies:', error);
        throw error;
      }
    },
  });
};