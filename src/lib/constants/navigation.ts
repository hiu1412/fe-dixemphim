import type { LucideIcon } from "lucide-react";

import {
  UserCircle,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    dropdownItems?: Array<{ title: string; href: string }>;
}


export const mainNavItems: NavItem[] = [
    {
      title: "Trang chủ",
      href: "/"
    },
    {
      title: "Phim mới",
      href: "/movies"
    },
  ];


  export const userNavItems: NavItem[] = [
    {
      title: "Hồ sơ",
      href: "/profile",
      icon: UserCircle
    },
    {
      title: "Đơn hàng",
      href: "/orders",
      icon: ShoppingBag
    },
  ];


  export const adminNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Quản lý phim",
      href: "/admin/movies",
    },
    

  
  ];