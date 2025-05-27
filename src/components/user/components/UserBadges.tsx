import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  active: boolean;
}

interface RoleBadgeProps {
  role: string;
}

export const StatusBadge = ({ active }: StatusBadgeProps) => {
  if (active) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 font-medium">
        Hoạt động
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="bg-red-100 text-red-800 font-medium">
      Đã khóa
    </Badge>
  );
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  if (role === 'admin') {
    return (
      <Badge variant="secondary" className="font-medium">
        Admin
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="font-medium">
      User
    </Badge>
  );
};