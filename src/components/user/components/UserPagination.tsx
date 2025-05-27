import { Pagination } from "@/components/Pagination/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const UserPagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: UserPaginationProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Hiển thị</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>trên tổng số {totalItems} người dùng</span>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          siblingCount={1}
        />
      )}
    </div>
  );
};