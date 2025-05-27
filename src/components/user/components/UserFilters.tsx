import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFilters as UserFiltersType } from "@/lib/api/types";

interface UserFiltersProps {
  filters: UserFiltersType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  updateFilter: (key: keyof UserFiltersType, value: any) => void;
  resetFilters: () => void;
  isFiltersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

export const UserFilters = ({
  filters,
  searchTerm,
  onSearchChange,
  updateFilter,
  resetFilters,
  isFiltersOpen,
  setFiltersOpen,
}: UserFiltersProps) => {
  return (
    <>
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFiltersOpen(!isFiltersOpen)}
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
      {isFiltersOpen && (
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
    </>
  );
};