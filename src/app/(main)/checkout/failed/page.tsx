"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useOrder } from "@/hooks/queries/order/use-order";
import { formatPrice } from "@/lib/utils";

export default function CheckoutFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const errorMessage = searchParams.get("error");
  const { currentOrder, cancelOrder, clearOrderData } = useOrder();

  // Nếu không có đơn hàng và không có orderId thì chuyển về trang chủ
  useEffect(() => {
    if (!currentOrder && !orderId) {
      router.replace("/");
    }
  }, [currentOrder, orderId, router]);

  const handleTryAgain = () => {
    clearOrderData(); // Chỉ xóa data khi user chọn thử lại
    router.push("/checkout");
  };

  const handleCancel = async () => {
    if (orderId) {
      await cancelOrder(orderId);
    }
    clearOrderData();
    router.push("/cart");
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-20">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold">Thanh toán thất bại!</h1>
        
        <div className="mt-6 p-6 border rounded-lg space-y-4 text-left">
          <h2 className="font-semibold">Thông tin đơn hàng</h2>
          
          {/* Payment Info */}
          <div className="flex justify-between">
            <span>Phương thức thanh toán:</span>
            <span className="capitalize">
              {currentOrder.paymentMethod === 'cod' ? 'Tiền mặt' : currentOrder.paymentMethod}
            </span>
          </div>
          
          {/* Order Summary */}
          <div className="flex justify-between text-muted-foreground">
            <span>Số lượng sản phẩm:</span>
            <span>
              {currentOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Tổng tiền:</span>
            <span>{formatPrice(currentOrder.totalAmount)}</span>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">
            {errorMessage || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button onClick={handleCancel} variant="outline">
            Hủy đơn hàng
          </Button>
          <Button onClick={handleTryAgain}>
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
}