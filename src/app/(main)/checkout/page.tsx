"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/use-auth";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrder } from "@/hooks/queries/order/use-order";
import { ShippingDetails } from "@/lib/api/services/order-service";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useQueryClient } from "@tanstack/react-query";

const TOAST_DURATION = 1500;

const shippingSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "payos", "vnpay"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const cartStore = useCartStore();
  const {
    setShippingDetails,
    setPaymentMethod,
    checkout,
    cancelOrder,
    isCheckingOut,
    isCancelling,
    isProcessing,
    currentOrder
  } = useOrder();

  // Check for retry attempt
  const retryOrderId = searchParams.get('retry');

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán", { duration: TOAST_DURATION });
      router.push("/auth/login");
      return;
    }

    if (cartStore.items.length === 0 && !retryOrderId) {
      toast.error("Giỏ hàng trống", { duration: TOAST_DURATION });
      router.push("/cart");
      return;
    }
  }, [isAuthenticated, cartStore.items.length, router, retryOrderId]);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      note: "",
      paymentMethod: "cod",
    },
  });

  const onSubmit = async (values: ShippingFormValues) => {
    const { paymentMethod, ...shippingDetails } = values;

    // Lưu thông tin vận chuyển và phương thức thanh toán
    setShippingDetails(shippingDetails);
    setPaymentMethod(paymentMethod);

    // Tiến hành thanh toán
    await checkout();
  };

  const handleCancel = () => {
    // If we have a current order, cancel it
    if (currentOrder?._id) {
      cancelOrder(currentOrder._id);
    } else {
      // Otherwise just go back to cart
      router.push('/cart');
    }
  };

  return (
    <>
      <LoadingOverlay 
        isLoading={isCheckingOut || isProcessing || isCancelling} 
        text={isCancelling ? "Đang hủy đơn hàng..." : "Đang xử lý thanh toán..."} 
      />
      
      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              {retryOrderId ? "Thử lại thanh toán" : "Thông tin thanh toán"}
            </h1>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isCheckingOut || isProcessing || isCancelling}
            >
              Hủy
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Details */}
              <div className="space-y-4">
                <FormField
                  label="Họ tên"
                  placeholder="Nhập họ tên"
                  {...form.register("fullName")}
                  error={form.formState.errors.fullName?.message}
                />
                <FormField
                  label="Email"
                  placeholder="Nhập email"
                  {...form.register("email")}
                  error={form.formState.errors.email?.message}
                />
                <FormField
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  {...form.register("phone")}
                  error={form.formState.errors.phone?.message}
                />
                <FormField
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ"
                  {...form.register("address")}
                  error={form.formState.errors.address?.message}
                />
                <FormField
                  label="Thành phố"
                  placeholder="Nhập thành phố"
                  {...form.register("city")}
                  error={form.formState.errors.city?.message}
                />
                <FormField
                  label="Ghi chú"
                  placeholder="Nhập ghi chú (nếu có)"
                  {...form.register("note")}
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <Label>Phương thức thanh toán</Label>
                <RadioGroup
                  name="paymentMethod"
                  className="grid grid-cols-3 gap-4"
                  value={form.watch("paymentMethod")}
                  onValueChange={(value: ShippingFormValues["paymentMethod"]) => 
                    form.setValue("paymentMethod", value)
                  }
                >
                  <div>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="ml-2">
                      Tiền mặt
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="payos" id="payos" disabled />
                    <Label htmlFor="payos" className="ml-2 text-muted-foreground">
                      PayOS
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="vnpay" id="vnpay" disabled />
                    <Label htmlFor="vnpay" className="ml-2 text-muted-foreground">
                      VNPay
                    </Label>
                  </div>
                </RadioGroup>
                {form.formState.errors.paymentMethod && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 space-y-4">
                <h2 className="font-semibold">Tổng quan đơn hàng</h2>
                <div className="flex justify-between">
                  <span>Số lượng sản phẩm:</span>
                  <span>{cartStore.getItemsCount()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Tổng tiền:</span>
                  <span>{cartStore.totalAmount.toLocaleString()}đ</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isCheckingOut || isProcessing || isCancelling}
              >
                {isCheckingOut ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}