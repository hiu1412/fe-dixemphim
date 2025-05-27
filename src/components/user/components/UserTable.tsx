import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, Eye, MoreVertical, Trash2, X } from "lucide-react";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { useToggleUserStatus } from "@/hooks/queries/user/user-list";
import { toast } from "sonner";
import { ApiUser } from "@/lib/api/types";

interface UserTableProps {
  users: ApiUser[];
  isLoading: boolean;
  isError: boolean;
  onViewUser: (user: ApiUser) => void;
  onDeleteUser: (user: ApiUser) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (error) {
    return "-";
  }
};

export const UserTable = ({ users, isLoading, isError, onViewUser, onDeleteUser }: UserTableProps) => {
  const toggleUserStatus = useToggleUserStatus();

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    toggleUserStatus.mutate(
      { userId, active: !isActive },
      {
        onSuccess: () => {
          toast.success(`Người dùng đã ${isActive ? "bị khóa" : "được kích hoạt"}`);
        },
        onError: () => {
          toast.error("Không thể thay đổi trạng thái người dùng");
        }
      }
    );
  };

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Tên người dùng</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Trạng thái</TableHead>
            <TableHead className="hidden md:table-cell">Vai trò</TableHead>
            <TableHead className="hidden md:table-cell">Ngày đăng ký</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-destructive">
                Có lỗi xảy ra khi tải dữ liệu
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Không tìm thấy người dùng nào phù hợp
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">#{user._id?.slice(-4)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{user.username}</span>
                  </div>
                  <span className="md:hidden text-xs text-muted-foreground block">{user.email}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <StatusBadge active={user.active} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.created_at ? formatDate(user.created_at) : '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user._id, user.active)}>
                        {user.active ? (
                          <>
                            <X className="mr-2 h-4 w-4 text-destructive" />
                            Khóa tài khoản
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Kích hoạt
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteUser(user)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};