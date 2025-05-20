"use client";
import { useNewest } from "@/hooks/queries/product/use-newest";
import { Heart, Eye, ShoppingCart, UserPlus } from "lucide-react";

export default function NewestProduct() {
    const { data, isLoading, error } = useNewest();

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {(error as Error).message}</div>;

   return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {data?.map((product) => (
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
              {/* Nút chức năng nổi lên khi hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-primary/80 transition"
                  title="Mua ngay"
                >
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </button>
                <button
                  className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-yellow-400/80 transition"
                  title="Theo dõi nghệ sĩ"
                >
                  <UserPlus className="w-5 h-5 text-yellow-500" />
                </button>
                <button
                  className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-red-400/80 transition"
                  title="Yêu thích"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                </button>
                <button
                  className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-gray-300/80 transition"
                  title="Xem chi tiết"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="w-full mt-3 px-1">
              <div className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">{product.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {/* Hiển thị nghệ sĩ nếu có */}
{product.artists
  ?.map((artist) => typeof artist === "string" ? artist : artist.name)
  .join(", ")
}              </div>
              <div className="font-bold text-primary dark:text-yellow-400 text-sm mt-1">{product.price.toLocaleString()} VNĐ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}