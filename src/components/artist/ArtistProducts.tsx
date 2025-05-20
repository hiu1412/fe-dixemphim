"use client"
import { useParams } from "next/navigation";
import { useProductsByArtist } from "@/hooks/queries/artist/use-productby";
import type { Product } from "@/lib/api/types";

export default function ArtistProducts() {
  const { id } = useParams();
  const { data: products, isLoading } = useProductsByArtist(id as string);

  if (isLoading) return <div>Đang tải...</div>;
  if (!products) return <div>Không có sản phẩm</div>;

 return (
  <div>
    <h2 className="text-2xl font-bold mb-4">Sản phẩm của nghệ sĩ</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {products.map((product: Product) => (
        <div
          key={product._id || product.name}
          className="group bg-transparent rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
        >
          <div className="relative w-full aspect-square overflow-hidden">
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
                {/* Thay thế bằng icon giỏ hàng nếu cần */}
                <span className="text-primary">🛒</span>
              </button>
              <button
                className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-yellow-400/80 transition"
                title="Theo dõi nghệ sĩ"
              >
                {/* Thay thế bằng icon theo dõi nếu cần */}
                <span className="text-yellow-500">➕</span>
              </button>
              <button
                className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-red-400/80 transition"
                title="Yêu thích"
              >
                {/* Thay thế bằng icon trái tim nếu cần */}
                <span className="text-red-500">❤️</span>
              </button>
              <button
                className="bg-white/80 dark:bg-neutral-800/80 rounded-full p-2 hover:bg-gray-300/80 transition"
                title="Xem chi tiết"
              >
                {/* Thay thế bằng icon mắt nếu cần */}
                <span className="text-gray-700">👁️</span>
              </button>
            </div>
          </div>
          <div className="w-full mt-3 px-1">
            <div className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">{product.name}</div>
            {product.artists && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {product.artists
                  .map((artist) => (typeof artist === 'string' ? artist : artist.name))
                  .join(', ')}
              </div>
            )}
            {/* Loại bỏ phần hiển thị giá */}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}