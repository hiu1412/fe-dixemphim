"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGoogleAuth } from "@/hooks/auth/use-google-auth";

export default function GoogleCallbackPage() {
  const { handleGoogleCallback, error } = useGoogleAuth();

  useEffect(() => {
    // Gọi hàm xử lý callback Google
    handleGoogleCallback();
  }, [handleGoogleCallback]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.href = "/auth/login"}>Quay lại đăng nhập</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <p className="text-lg font-medium">Đang xử lý đăng nhập...</p>
    </div>
  );
}