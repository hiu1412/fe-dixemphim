import { useQuery } from "@tanstack/react-query";
import productService from "@/lib/api/services/product-service";
import { ProductFilters, ProductListResponse } from "@/lib/api/types";
import { usePagination } from "@/hooks/UsePaginationOption/usePagination";

const defaultFilters: ProductFilters = {
  page: 1,
  limit: 10
};

export const useProducts = (initialFilters?: Partial<ProductFilters>) => {
  const pagination = usePagination({
    defaultFilters: {
      ...defaultFilters,
      ...initialFilters
    }
  });

  const query = useQuery<ProductListResponse>({
    queryKey: ["products", pagination.filters],
    queryFn: () => productService.list(pagination.filters),
  });

  return {
    ...query,
    pagination
  };
};