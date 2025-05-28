import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/lib/api/services/product-service";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Thêm sản phẩm thành công");
    },
    onError: (error: Error) => {
      toast.error("Lỗi khi thêm sản phẩm: " + error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Cập nhật sản phẩm thành công");
    },
    onError: (error: Error) => {
      toast.error("Lỗi khi cập nhật sản phẩm: " + error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: (error: Error) => {
      toast.error("Lỗi khi xóa sản phẩm: " + error.message);
    },
  });
};