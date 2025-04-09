import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";
import { useLogin } from "@/hooks/auth/use-login";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const login = useLogin();
    const isLoading = login.isPending;

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
            return;
        }

        setError("");
        try {
            login.mutate(
                { email, password },
                {
                    onError: (error: any) => {
                        console.error("Đăng nhập không được đâu:", error);
                        setError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập");
                    }
                }
            );
        } catch (error) {
            console.error("Đăng nhập không được đâu:", error);
            setError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập");
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
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

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                    Ghi nhớ đăng nhập
                </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
}