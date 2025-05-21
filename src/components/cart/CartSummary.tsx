import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  totalAmount: number;
}

export default function CartSummary({ totalAmount }: CartSummaryProps) {
  return (
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
  );
}