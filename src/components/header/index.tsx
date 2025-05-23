"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth/use-auth";
import { ThemeToggle } from "../theme-toggle";
import { Navbar } from "./navbar";
import { Button } from "../ui/button";
import { UserButton } from "./user-button";
import { SearchIcon, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const cartStore = useCartStore();
  const [cartCount, setCartCount] = useState(0);

  // Theo dõi thay đổi của giỏ hàng và cập nhật số lượng
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartStore.getItemsCount();
      setCartCount(count);
    };

    // Cập nhật lần đầu
    updateCartCount();

    // Đăng ký listener cho các thay đổi của store
    const unsubscribe = useCartStore.subscribe((state) => {
      updateCartCount();
    });

    return () => {
      unsubscribe();
    };
  }, [cartStore]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center space-x-2 pl-2">
            <span className="hidden font-bold sm:inline-block">DINGHENHAC</span>
          </Link>

          {/* Main Navigation */}
          <Navbar />
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {isAuthenticated ? (
              <UserButton user={user} onLogout={logout} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                {/* Nút Đăng nhập */}
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                {/* Nút Đăng ký */}
                <Button asChild>
                  <Link href="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}