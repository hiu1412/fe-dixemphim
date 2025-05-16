"use client";
import { useNewest } from "@/hooks/queries/use-newest";
import { Heart, Eye, ShoppingCart, UserPlus } from "lucide-react";

export default function NewestProduct() {
    const { data, isLoading, error } = useNewest();

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {(error as Error).message}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {data?.map((product) => (
                    <div
                        key={product._id}
                        className="group bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col border border-neutral-200 dark:border-neutral-700 overflow-visible"
                    >
                        <div className="relative overflow-visible">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-t-xl transition-all duration-300
          group-hover:scale-110 group-hover:rounded-xl group-hover:z-10 group-hover:shadow-2xl "
                                style={{ position: "relative" }}
                            />
                        </div>
                        <div className="flex-1 flex flex-col p-4">
                            <div className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900 dark:text-gray-100">{product.name}</div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</div>
                            <div className="font-bold text-primary dark:text-yellow-400 mb-4">{product.price.toLocaleString()} VNĐ</div>
                            <div className="mt-auto flex gap-2 items-center justify-between">
                                <button
                                    className="flex-1 flex items-center justify-center gap-1 bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition font-semibold"
                                    title="Mua ngay"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Múc ngay
                                </button>
                                <button
                                    className="flex items-center justify-center gap-1 border border-primary text-primary dark:text-yellow-400 dark:border-yellow-400 rounded-lg py-2 px-3 hover:bg-primary/10 dark:hover:bg-yellow-400/10 transition"
                                    title="Theo dõi nghệ sĩ"
                                >
                                    <UserPlus className="w-4 h-4" />
                                </button>
                                <button
                                    className="flex items-center justify-center gap-1 border border-red-400 text-red-400 rounded-lg py-2 px-3 hover:bg-red-100 dark:hover:bg-red-400/10 transition"
                                    title="Yêu thích"
                                >
                                    <Heart className="w-4 h-4" />
                                </button>
                                <button
                                    className="flex items-center justify-center gap-1 border border-gray-400 text-gray-500 rounded-lg py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    title="Xem chi tiết"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}