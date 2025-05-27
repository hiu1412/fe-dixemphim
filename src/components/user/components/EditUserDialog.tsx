import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUpdateUser } from "@/hooks/queries/user/user-list";
import { ApiUser } from "@/lib/api/types";
import { useState, useEffect } from "react";

interface EditUserDialogProps {
  user: ApiUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditUserDialog = ({ user, open, onOpenChange }: EditUserDialogProps) => {
  const updateUser = useUpdateUser();
  const [formData, setFormData] = useState<{
    username?: string;
    email?: string;
    role?: "admin" | "user";
  }>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUser.mutate(
      {
        userId: user._id,
        userData: formData
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({}); // Reset form
        }
      }
    );
  };

  // Reset form when dialog opens with new user
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "user")) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên người dùng</label>
              <Input
                value={formData.username || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Nhập tên người dùng"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vai trò</label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user") => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};