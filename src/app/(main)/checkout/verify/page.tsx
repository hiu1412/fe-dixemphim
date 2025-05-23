"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrder } from "@/hooks/queries/order/use-order";
import { Loader2 } from "lucide-react";

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPayment } = useOrder();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const token = searchParams.get("token");
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    if (!orderId) {
      router.replace("/");
      return;
    }

    const verify = async () => {
      try {
        // Handle VNPay response
        if (vnp_ResponseCode) {
          // VNPay success code is "00"
          if (vnp_ResponseCode === "00") {
            await verifyPayment(orderId);
            router.push(`/checkout/success?orderId=${orderId}`);
          } else {
            router.push(`/checkout/failed?orderId=${orderId}`);
          }
          return;
        }

        // Handle PayOS response
        if (token) {
          await verifyPayment(orderId);
          router.push(`/checkout/success?orderId=${orderId}`);
        } else {
          router.push(`/checkout/failed?orderId=${orderId}`);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
        router.push(`/checkout/failed?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`);
      }
    };

    verify();
  }, [router, searchParams, verifyPayment]);

  return (
    <div className="container max-w-2xl mx-auto py-20">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="w-20 h-20 animate-spin text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Đang xác minh thanh toán...</h1>
        <p className="text-muted-foreground">
          Vui lòng không đóng trang này trong quá trình xác minh thanh toán.
        </p>
      </div>
    </div>
  );
}