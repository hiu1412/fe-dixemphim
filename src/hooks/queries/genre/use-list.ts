import { useQuery } from "@tanstack/react-query";
import genreService from "@/lib/api/services/genre-service";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: genreService.list,
  });
};