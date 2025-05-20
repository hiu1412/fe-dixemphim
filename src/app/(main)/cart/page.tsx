"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  // Lấy dữ liệu từ cart store
  const { items, totalAmount, updateQuantity, removeItem } = useCartStore();
  
  // State để tránh lỗi hydration
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Nếu chưa hydrate, không render gì để tránh mismatch
  if (!isClient) {
    return null;
  }

  // Nếu giỏ hàng trống
  if (!items.length) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
        <p className="text-muted-foreground mb-6">Giỏ hàng của bạn đang trống.</p>
        <Button asChild>
          <Link href="/product">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Giỏ hàng</h1>
      
      {/* Header labels - Desktop */}
      <div className="hidden md:grid grid-cols-12 py-3 border-b text-sm text-muted-foreground">
        <div className="col-span-6">Sản phẩm</div>
        <div className="col-span-2 text-center">Giá</div>
        <div className="col-span-2 text-center">Số lượng</div>
        <div className="col-span-2 text-center">Tổng</div>
      </div>
      
      {/* Cart items */}
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.product} className="grid grid-cols-1 md:grid-cols-12 py-6 items-center gap-4">
            {/* Product info */}
            <div className="col-span-1 md:col-span-6 flex items-center gap-4">
              <div className="relative w-20 h-20 aspect-square rounded bg-muted/20 overflow-hidden">
                <Image 
                  src={item.productImage} 
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.productName}</h3>
                {/* Mobile only price */}
                <div className="md:hidden mt-1 text-muted-foreground">
                  {formatPrice(item.price)}
                </div>
              </div>
              {/* Remove button */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeItem(item.product)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Price - Desktop */}
            <div className="hidden md:block md:col-span-2 text-center">
              {formatPrice(item.price)}
            </div>
            
            {/* Quantity */}
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="w-10 h-8 flex items-center justify-center text-sm">
                  {item.quantity}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => updateQuantity(item.product, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Total */}
            <div className="col-span-1 md:col-span-2 text-center font-medium">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Cart summary */}
      <div className="mt-8 md:ml-auto md:max-w-md">
        <div className="bg-muted/10 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Tổng giỏ hàng</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Tổng cộng</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <Button className="w-full" asChild>
              <Link href="/checkout">Tiến hành thanh toán</Link>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/product">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}