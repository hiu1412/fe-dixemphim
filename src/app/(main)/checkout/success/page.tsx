"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useOrder } from "@/hooks/queries/order/use-order";
import { formatPrice } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { currentOrder, clearOrderData } = useOrder();

  // Nếu không có đơn hàng và không có orderId thì chuyển về trang chủ
  useEffect(() => {
    if (!currentOrder && !orderId) {
      router.replace("/");
    }
  }, [currentOrder, orderId, router]);

  const handleContinueShopping = () => {
    clearOrderData(); // Chỉ xóa data khi user chọn tiếp tục mua sắm
    router.push("/");
  };

  const handleViewOrders = () => {
    clearOrderData(); // Chỉ xóa data khi user chọn xem đơn hàng
    router.push("/orders");
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-20">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
        
        <div className="mt-6 p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-left">Thông tin đơn hàng</h2>
          
          {/* Delivery Info */}
          <div className="text-left space-y-2">
            <p className="text-muted-foreground">Giao đến:</p>
            <p>{currentOrder.shippingDetails.fullName}</p>
            <p>{currentOrder.shippingDetails.phone}</p>
            <p>{currentOrder.shippingDetails.address}</p>
            <p>{currentOrder.shippingDetails.city}</p>
            {currentOrder.shippingDetails.note && (
              <p className="text-muted-foreground">
                Ghi chú: {currentOrder.shippingDetails.note}
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Phương thức thanh toán:</span>
              <span className="capitalize">
                {currentOrder.paymentMethod === 'cod' ? 'Tiền mặt' : currentOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Số lượng sản phẩm:</span>
              <span>
                {currentOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Tổng tiền:</span>
              <span>{formatPrice(currentOrder.totalAmount)}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất có thể.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={handleViewOrders} variant="outline">
            Xem đơn hàng
          </Button>
          <Button onClick={handleContinueShopping}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}