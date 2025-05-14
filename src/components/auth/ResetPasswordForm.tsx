"use client"
import { useState } from "react";
import { useEmailAuth } from "@/hooks/auth/use-email-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useEmailAuth();
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }
    resetPassword.mutate(
      { token, newPassword },
      {
        onError: (err: any) => {
          setError(
            err?.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
          );
        },
        onSuccess: () => {
          setTimeout(() => {
            router.push("/auth/login"); // hoặc "/" nếu muốn về trang chủ
          }, 1500); // Đợi 1.5s cho user đọc thông báo
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      {resetPassword.isSuccess && (
        <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-600 rounded-md">
          Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="newPassword">Mật khẩu mới</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={resetPassword.status === "pending"}>
  {resetPassword.status === "pending" ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
</Button>
    </form>
  );
}