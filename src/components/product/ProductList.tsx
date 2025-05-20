"use client";

import { useProducts } from "@/hooks/queries/product/use-list";
import { Heart, Eye, ShoppingCart, UserPlus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductList() {
  const { data, isLoading, error } = useProducts();
  const { addItem, isItemInCart, removeItem } = useCartStore();
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {(error as Error).message}</div>;

  const handleAddToCart = (product: any) => {
    console.log("Adding product to cart:", product);
    
    // Thêm sản phẩm vào giỏ hàng
    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
    try {
      addItem(product);
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
    
    // Xóa trạng thái đang thêm sau 1.5s
    setTimeout(() => {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const handleToggleCart = (product: any) => {
    // Nếu sản phẩm đã có trong giỏ hàng, xóa ra, ngược lại thì thêm vào
    if (isItemInCart(product._id)) {
      removeItem(product._id);
      toast.success(`Đã xóa ${product.name} khỏi giỏ hàng`);
    } else {
      handleAddToCart(product);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {data?.map((product) => {
          // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
          const isInCart = isItemInCart(product._id);
          // Kiểm tra xem đang có animation thêm vào giỏ không
          const isAdding = addingToCart[product._id];
          
          return (
            <div
              key={product._id}
              className="group bg-transparent rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
            >
              <div className="relative w-full aspect-square overflow-visible">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:z-10"
                />
                
                {/* Nút chức năng nổi lên khi hover - UPDATED - Style theo hình ảnh */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Giỏ hàng */}
                  <button
                    onClick={() => handleToggleCart(product)}
                    disabled={isAdding}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                    title={isInCart ? "Xóa khỏi giỏ" : "Thêm vào giỏ hàng"}
                  >
                    <ShoppingCart 
                      className={`w-5 h-5 ${isInCart ? "text-primary" : "text-gray-700"}`} 
                    />
                  </button>
                  
                  {/* Người dùng/Theo dõi */}
                  <button
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                    title="Theo dõi nghệ sĩ"
                  >
                    <UserPlus className="w-5 h-5 text-amber-500" />
                  </button>
                  
                  {/* Yêu thích */}
                  <button
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                    title="Yêu thích"
                  >
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  
                  {/* Xem chi tiết */}
                  <Link 
                    href={`/product/${product._id}`}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </Link>
                </div>
              </div>
              
              <div className="w-full mt-3 px-4">
                <div className="font-semibold text-base truncate">{product.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {product.artists
                    ?.map((artist) => typeof artist === "string" ? artist : artist.name)
                    .join(", ")
                  }
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="font-medium">{product.price?.toLocaleString() || 0} VNĐ</div>
                  
                  {isInCart && (
                    <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Đã thêm
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}