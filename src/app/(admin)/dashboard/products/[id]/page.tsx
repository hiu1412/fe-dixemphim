"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateProduct } from "@/hooks/queries/product/use-mutations";
import productService from "@/lib/api/services/product-service";
import ProductForm from "@/components/product/ProductForm";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => productService.getById(params.id),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      router.push("/dashboard/products");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="w-full h-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleSubmit = (formData: FormData) => {
    updateProduct({ id: params.id, data: formData });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h2>
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}