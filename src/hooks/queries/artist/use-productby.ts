import { useQuery } from "@tanstack/react-query";
import artistService from "@/lib/api/services/artist-service";

export const useProductsByArtist = (artistId: string) => {
  return useQuery({
    queryKey: ["products-by-artist", artistId],
    queryFn: () => artistService.getProducts(artistId),
    enabled: !!artistId,
  });
};