import type { LucideIcon } from "lucide-react";

import {
  UserCircle,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";

//đảm bảo theo một cấu trúc nhất định 
interface NavItem {
    title: string;//tiêu đề chuỗi
    href: string;//link chuỗi
    icon?: LucideIcon;// tùy chọnchọn
    dropdownItems?: Array<{ title: string; href: string }>;//mục con
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