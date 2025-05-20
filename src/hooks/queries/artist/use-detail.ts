import { useQuery } from "@tanstack/react-query";
import artistService from "@/lib/api/services/artist-service";

export function useArtistDetail(id: string) {
  return useQuery({
    queryKey: ["artist", id],
    queryFn: () => artistService.getById(id),
    enabled: !!id,
  });
}