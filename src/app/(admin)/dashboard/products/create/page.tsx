"use client";

import { useCreateProduct } from "@/hooks/queries/product/use-mutations";
import ProductForm from "@/components/product/ProductForm";

export default function CreateProduct() {
  const { mutate: createProduct, isPending } = useCreateProduct();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Thêm sản phẩm mới</h2>
      <ProductForm 
        onSubmit={formData => createProduct(formData)} 
        isLoading={isPending}  
      />
    </div>
  );
}