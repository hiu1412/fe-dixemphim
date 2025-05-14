import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h1>
      <ResetPasswordForm token={params.token} />
    </div>
  );
}