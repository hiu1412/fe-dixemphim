import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const userRole = request.cookies.get("user-role");
  const path = request.nextUrl.pathname;

  // Skip middleware cho static files
  if (path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  // Chỉ kiểm tra admin routes
  if (path.startsWith("/admin") && (!accessToken || userRole?.value !== "admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng middleware cho admin routes
export const config = {
  matcher: ["/admin/:path*"]
};