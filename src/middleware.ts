import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các routes không cần bảo vệ
const publicPaths = [
  "/",
  "/movies",
  "/about",
  "/auth/login",
  "/auth/register"
];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const userRole = request.cookies.get("user-role");
  const path = request.nextUrl.pathname;

  // Skip middleware cho static files
  if (path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  // Kiểm tra nếu là public path
  const isPublicPath = publicPaths.some(p => path === p);
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Kiểm tra nếu đang ở trang auth mà đã đăng nhập
  if (path.startsWith("/auth/") && accessToken) {
    return NextResponse.redirect(
      new URL(userRole?.value === "admin" ? "/admin/dashboard" : "/", request.url)
    );
  }

  // Kiểm tra admin routes
  if (path.startsWith("/admin") && (!accessToken || userRole?.value !== "admin")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Protected routes - cần đăng nhập
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các routes cần thiết
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/auth/:path*"]
};