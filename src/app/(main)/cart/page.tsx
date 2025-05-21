"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/queries/cart/use-cart";
import { useAuth } from "@/hooks/auth/use-auth";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItemList from "@/components/cart/CartItemList";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, updateCart, removeCart } = useCart();
  
  // State để tránh lỗi hydration
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Nếu chưa hydrate, không render gì để tránh mismatch
  if (!isClient) {
    return null;
  }

  // Handler cho update quantity
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0 && cart) {
      try {
        updateCart({
          productId,
          quantity: newQuantity
        });
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  // Handler cho remove item
  const handleRemoveItem = (productId: string) => {
    if (!productId) return;
    try {
      removeCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Nếu giỏ hàng trống
  if (!cart || !cart.items?.length) {
    return <EmptyCart />;
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
      <CartItemList 
        items={cart.items} 
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      {/* Cart summary */}
      <CartSummary totalAmount={cart.totalAmount} />
    </div>
  );
}