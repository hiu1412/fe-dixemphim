"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCartStore();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // State để tránh lỗi hydration
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chuyển hướng nếu chưa đăng nhập hoặc giỏ hàng trống
  useEffect(() => {
    if (isClient && !isLoading) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thanh toán");
        router.push("/auth/login?redirect=/cart/checkout");
      } else if (items.length === 0) {
        toast.error("Giỏ hàng trống");
        router.push("/cart");
      }
    }
  }, [isClient, isLoading, isAuthenticated, items.length, router]);

  // Nếu chưa hydrate hoặc đang loading, không render gì
  if (!isClient || isLoading) {
    return null;
  }

  // Nếu giỏ hàng trống, chuyển hướng (sẽ được xử lý bởi useEffect)
  if (items.length === 0) {
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Giả lập thanh toán thành công
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Xử lý đơn hàng thành công
      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin đơn hàng */}
        <div className="md:col-span-2">
          <div className="bg-background border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product} className="flex gap-4 py-4 border-b last:border-0">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-medium">{item.productName}</h3>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Phương thức thanh toán */}
          <div className="bg-background border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  id="cod" 
                  checked 
                  readOnly
                  className="form-radio h-4 w-4 text-primary"
                />
                <label htmlFor="cod" className="flex-grow">
                  <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                  <p className="text-sm text-muted-foreground">
                    Bạn sẽ thanh toán khi nhận được hàng
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tổng đơn hàng */}
        <div className="md:col-span-1">
          <div className="bg-background border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Tổng cộng</span>
                <span className="text-lg">{formatPrice(totalAmount)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart">Quay lại giỏ hàng</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}