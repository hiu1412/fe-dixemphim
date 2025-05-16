import { useQuery } from "@tanstack/react-query";
import productService from "@/lib/api/services/product-service";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productService.list,
  });
};