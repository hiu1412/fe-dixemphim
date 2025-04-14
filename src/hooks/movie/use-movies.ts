import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/lib/api/services/movie-service";
import { useMovieStore } from "@/store/use-movie-store";
import { ApiResponse, Movie } from "@/lib/api/types";

export const useMovies = () => {
  const { setMovies } = useMovieStore();

  return useQuery<ApiResponse<string, Movie[]>>({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await movieService.getAllMovies();
      const data = response.data;
      if (data?.data) {
        setMovies(data.data);
      }
      return data;
    },
  });
};

export const useNewestMovies = () => {
  const { setNewestMovies } = useMovieStore();

  return useQuery<ApiResponse<string, Movie[]>>({
    queryKey: ["newest-movies"],
    queryFn: async () => {
      const response = await movieService.getNewest();
      const data = response.data;
      if (data?.data) {
        setNewestMovies(data.data);
      }
      return data;
    },
  });
};

export const useMovie = (id: string) => {
  const { setSelectedMovie } = useMovieStore();

  return useQuery<ApiResponse<string, Movie>>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const response = await movieService.getById(id);
      const data = response.data;
      if (data?.data) {
        setSelectedMovie(data.data);
      }
      return data;
    },
    enabled: !!id,
  });
};