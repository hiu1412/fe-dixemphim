import { Button } from "@/components/ui/button";
import { useGoogleAuth } from "@/hooks/auth/use-google-auth";
import { FaGoogle } from "react-icons/fa";

export function GoogleButton() {
  const { handleGoogleLogin, isRedirecting } = useGoogleAuth(); // Sử dụng hook

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin} // Gọi hàm chuyển hướng
      disabled={isRedirecting} // Vô hiệu hóa khi đang chuyển hướng
      className="w-full flex items-center justify-center gap-2"
    >
      <FaGoogle className="h-4 w-4" />
      <span>
        {isRedirecting ? "Đang chuyển hướng..." : "Đăng nhập với Google"}
      </span>
    </Button>
  );
}