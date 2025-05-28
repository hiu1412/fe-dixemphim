"use client";

import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/queries/product/use-list";
import { useDeleteProduct } from "@/hooks/queries/product/use-mutations";
import { Product, Artist } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatPrice } from "@/lib/utils";

export default function ProductList() {
  const router = useRouter();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { data, pagination, isLoading } = useProducts();
  const products = data?.data || [];
  const paginationInfo = data?.pagination;

  const onPageChange = (page: number) => {
    pagination.setPage(page);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(productId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
        <Button onClick={() => router.push("/dashboard/products/create")}>
          Thêm sản phẩm
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          className="max-w-sm"
          // TODO: Implement search when BE supports it
          onChange={(e) => {
            console.log("Search:", e.target.value);
          }}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Nghệ sĩ</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {product.artists
                    .map((artist) =>
                      typeof artist === "string" ? artist : artist.name
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/products/${product._id}`)}
                    >
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm "{product.name}"?
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isLoading && (
        <div className="w-full h-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {paginationInfo && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(paginationInfo.page - 1)}
                isActive={paginationInfo.page > 1}
              />
            </PaginationItem>
            {Array.from({ length: paginationInfo.totalPages }).map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => onPageChange(index + 1)}
                  isActive={paginationInfo.page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(paginationInfo.page + 1)}
                isActive={paginationInfo.page < paginationInfo.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}