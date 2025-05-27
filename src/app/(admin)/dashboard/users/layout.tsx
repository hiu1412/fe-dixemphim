import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      </div>
      <Card className="p-0 overflow-hidden">
        {children}
      </Card>
    </div>
  );
}