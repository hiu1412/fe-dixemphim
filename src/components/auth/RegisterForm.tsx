import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/hooks/auth/use-register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const register = useRegister();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !username) {
            setError("Vui lòng nhập đầy đủ thông tin đăng ký");
            return;
        }

        setError("");

        register.mutate(
            { email, password, username },
            {
                onSuccess: () => {
                    console.log("Đăng ký thành công!");
                },
                onError: (error) => {
                    console.error("Đăng ký thất bại:", error);
                    setError(
                        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
                    );
                },
            }
        );
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
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
                <Label htmlFor="username">Tên người dùng</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={register.isPending}>
                {register.isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        </form>
    );
} 