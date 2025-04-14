import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import AdminProtected from "./AdminProtected";
interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProtected>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </AdminProtected>
  );
}
