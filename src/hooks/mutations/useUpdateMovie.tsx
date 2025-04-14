import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { useAdminStore } from '@/store/use-admin-store';
import { toast } from 'sonner';
import type { Movie } from '@/lib/api/types';

interface UpdateMovieInput{
    id: string;
    title: string;
    description: string;
    duration: number;
    poster: string;
    director: string;
    rating: number;
}


export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  const { movies, setMovies } = useAdminStore();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateMovieInput) => {
      // Create FormData object
      const formData = new FormData();
     
      if(input.title) formData.append('title', input.title);
      if(input.description) formData.append('description', input.description);
      if(input.duration) formData.append('duration', input.duration.toString());
      if(input.poster) formData.append('poster', input.poster);
      if(input.director) formData.append('director', input.director);
      if(input.rating) formData.append('rating', input.rating.toString());

      const response = await adminApi.updateMovie(id, formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update admin store
      const updatedMovie = data.data.movie as Movie;
      setMovies(
        movies.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie)),
        movies.length
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      
      toast.success('Phim đã được cập nhật thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật xe');
    },
  });
}; 