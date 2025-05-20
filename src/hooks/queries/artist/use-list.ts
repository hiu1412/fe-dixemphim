import { useQuery } from "@tanstack/react-query";
import artistService from "@/lib/api/services/artist-service";

export const useArtist = () => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: artistService.list,
    
  });
};