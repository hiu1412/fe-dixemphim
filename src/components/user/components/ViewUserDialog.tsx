import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { ApiUser } from "@/lib/api/types";

interface ViewUserDialogProps {
  user: ApiUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const ViewUserDialog = ({ user, open, onOpenChange }: ViewUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin tài khoản người dùng
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-1">
            <span className="font-medium">ID</span>
            <span>{user._id}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Tên người dùng</span>
            <span>{user.username}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Vai trò</span>
            <RoleBadge role={user.role} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Trạng thái</span>
            <StatusBadge active={user.active} />
          </div>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">Email đã xác thực</span>
            <span>
              {user.email_verified_at ? "Đã xác thực" : "Chưa xác thực"}
            </span>
          </div>
          {user.created_at && (
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Ngày tạo</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
          )}
          {user.updated_at && (
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Cập nhật lần cuối</span>
              <span>{formatDate(user.updated_at)}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};