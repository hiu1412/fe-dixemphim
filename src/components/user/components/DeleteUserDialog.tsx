import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/queries/user/user-list";
import { toast } from "sonner";
import { ApiUser } from "@/lib/api/types";

interface DeleteUserDialogProps {
  user: ApiUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteUserDialog = ({ user, open, onOpenChange }: DeleteUserDialogProps) => {
  const deleteUser = useDeleteUser();

  const handleDeleteConfirm = () => {
    if (!user) return;
    
    deleteUser.mutate(user._id, {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("Đã xóa người dùng thành công");
      },
      onError: (error: any) => {
        toast.error("Không thể xóa người dùng", {
          description: error.message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};