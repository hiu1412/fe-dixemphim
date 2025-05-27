"use client";

import { useState } from "react";
import { UserFilters } from "@/lib/api/types";
import { useUserList, useToggleUserStatus, useDeleteUser } from "@/hooks/queries/user/user-list";
import { usePagination } from "@/hooks/UsePaginationOption/usePagination";
import { useRouter, usePathname } from "next/navigation";
import { Pagination } from "@/components/Pagination/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Check, ChevronDown, Eye, Filter, MoreVertical, Search, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";

// Interface cho dữ liệu từ API
interface ApiUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
}

// Interface cho props
interface UsersPageProps {
  initialPage?: number;
}

export default function UsersPage({ initialPage = 1 }: UsersPageProps) {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  
  // States và filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const defaultFilters: UserFilters = {
    page: initialPage,
    limit: 10,
    sortBy: "created_at:desc",
  };

  const { 
    filters, 
    updateFilter, 
    setPage: setPageInternal, 
    setLimit, 
    setSearch,
    resetFilters 
  } = usePagination<UserFilters>({
    defaultFilters,
  });
  
  // Custom page change handler to update URL
  const handlePageChange = (page: number) => {
    setPageInternal(page);
    
    // Update URL
    if (page === 1) {
      router.replace(pathname);
    } else {
      router.replace(`${pathname}?page=${page}`);
    }
  };

  // React Query hooks
  const { data: apiData, isLoading, isError } = useUserList(filters);
  const toggleUserStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  // Transform API data
  const usersData = apiData ? {
    items: apiData.items || [] as ApiUser[],
    pagination: {
      total: apiData.items?.length || 0,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil((apiData.items?.length || 0) / (filters.limit || 10))
    }
  } : null;

  // Filtered users - handle null safety
  const filteredUsers = usersData?.items.filter((user: ApiUser) => 
    user.username.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    user.email.toLowerCase().includes((searchTerm || '').toLowerCase())
  ) || [];

  // Event handlers
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

  const handleDeleteClick = (user: ApiUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    
    deleteUser.mutate(selectedUser._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success("Đã xóa người dùng thành công");
      },
      onError: (error: any) => {
        toast.error("Không thể xóa người dùng", {
          description: error.message,
        });
      },
    });
  };

  // Format date helper
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

  // Status badge component
  const StatusBadge = ({ active }: { active: boolean }) => {
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

  // Priority badge component
  const PriorityBadge = ({ role }: { role: string }) => {
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

  return (
    <div>
      {/* Top section - Search and filters */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Lọc
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
          <Select
            value={filters.sortBy || "created_at:desc"}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Mới nhất</SelectItem>
              <SelectItem value="created_at:asc">Cũ nhất</SelectItem>
              <SelectItem value="username:asc">Tên (A-Z)</SelectItem>
              <SelectItem value="username:desc">Tên (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filters panel - Only visible when filtersOpen is true */}
      {filtersOpen && (
        <div className="border-b p-4 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Vai trò</label>
              <Select
                value={filters.role || "all"}
                onValueChange={(value) => updateFilter("role", value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={filters.active === undefined ? "all" : filters.active ? "true" : "false"}
                onValueChange={(value) => {
                  if (value === "all") {
                    updateFilter("active", undefined);
                  } else {
                    updateFilter("active", value === "true");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="true">Đang hoạt động</SelectItem>
                  <SelectItem value="false">Đã khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Main table */}
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
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào phù hợp
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: ApiUser) => (
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
                    <PriorityBadge role={user.role} />
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
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setIsViewOpen(true);
                        }}>
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
                          onClick={() => handleDeleteClick(user)}
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

      {/* Pagination footer */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Hiển thị</span>
          <Select
            value={String(filters.limit || 10)}
            onValueChange={(value) => setLimit(Number(value))}
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
          <span>trên tổng số {usersData?.pagination.total || 0} người dùng</span>
        </div>

        {usersData && usersData.pagination.totalPages > 1 && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={usersData.pagination.totalPages}
            onPageChange={handlePageChange}
            siblingCount={1}
          />
        )}
      </div>

      {/* View User Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
            <DialogDescription>
              Chi tiết thông tin tài khoản người dùng
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1">
                <span className="font-medium">ID</span>
                <span>{selectedUser._id}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Tên người dùng</span>
                <span>{selectedUser.username}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Email</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Vai trò</span>
                <PriorityBadge role={selectedUser.role} />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Trạng thái</span>
                <StatusBadge active={selectedUser.active} />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">Email đã xác thực</span>
                <span>
                  {selectedUser.email_verified_at ? "Đã xác thực" : "Chưa xác thực"}
                </span>
              </div>
              {selectedUser.created_at && (
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Ngày tạo</span>
                  <span>{formatDate(selectedUser.created_at)}</span>
                </div>
              )}
              {selectedUser.updated_at && (
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Cập nhật lần cuối</span>
                  <span>{formatDate(selectedUser.updated_at)}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{selectedUser.username}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {selectedUser.email}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteUser.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Đang xử lý..." : "Xóa người dùng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}