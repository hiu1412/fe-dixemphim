import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
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