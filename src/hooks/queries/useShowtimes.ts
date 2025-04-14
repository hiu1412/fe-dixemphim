import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios-instance';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse, Showtime } from '@/lib/api/types';

export const SHOWTIMES_QUERY_KEY = ['showtimes'] as const;

export const useShowtimes = (movieId: string) => {
    return useQuery({
        queryKey: [...SHOWTIMES_QUERY_KEY, movieId],
        queryFn: async () => {
            const response = await axiosInstance.get<ApiResponse<Showtime[]>>(`${API_ENDPOINTS.SHOWTIMES}/${movieId}`);
            return response.data.data;
        },
    });
}; 