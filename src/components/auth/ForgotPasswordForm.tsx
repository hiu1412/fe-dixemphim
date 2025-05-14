"use client"
import { useState } from "react";
import { useEmailAuth } from "@/hooks/auth/use-email-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { requestResetEmail } = useEmailAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    requestResetEmail.mutate(email, {
      onError: (err: any) => {
        setError(
          err?.response?.data?.message || "Gửi email thất bại. Vui lòng thử lại."
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      {requestResetEmail.isSuccess && (
        <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
          Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
<Button
  type="submit"
  className="w-full"
  disabled={requestResetEmail.status === "pending"}
>
  {requestResetEmail.status === "pending"
    ? "Đang gửi..."
    : "Gửi email đặt lại mật khẩu"}
</Button>      
    </form>
  );
}