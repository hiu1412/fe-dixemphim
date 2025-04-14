import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/lib/api/services/movie-service';

export const ALL_MOVIES_QUERY_KEY = ['movies', 'all'] as const;

interface UseAllMoviesParams {
  page?: number;
}

export const useAllMovies = ({ page = 1 }: UseAllMoviesParams = {}) => {
  return useQuery({
    queryKey: [...ALL_MOVIES_QUERY_KEY, page],
    queryFn: () => movieService.getAllMovies(),
  });
};