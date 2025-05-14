import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h1>
      <ForgotPasswordForm />
    </div>
  );
}