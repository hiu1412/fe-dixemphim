"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ApiUser, UserFilters as UserFiltersType } from "@/lib/api/types";
import { useUserList } from "@/hooks/queries/user/user-list";
import { usePagination } from "@/hooks/UsePaginationOption/usePagination";

import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { UserPagination } from "./components/UserPagination";
import { ViewUserDialog } from "./components/ViewUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

interface UsersPageProps {
  initialPage?: number;
}

export default function UsersPage({ initialPage = 1 }: UsersPageProps) {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  
  // States
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser| null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const defaultFilters: UserFiltersType = {
    page: initialPage,
    limit: 10,
    sortBy: "created_at:desc",
  };

  const { 
    filters, 
    updateFilter, 
    setPage,
    setLimit, 
    setSearch,
    resetFilters 
  } = usePagination<UserFiltersType>({
    defaultFilters,
  });
  
  // Custom page change handler to update URL
  const handlePageChange = (page: number) => {
    setPage(page);
    
    // Update URL
    if (page === 1) {
      router.replace(pathname);
    } else {
      router.replace(`${pathname}?page=${page}`);
    }
  };

  // React Query hooks
  const { data: apiData, isLoading, isError } = useUserList(filters);

  // Transform API data
  const usersData = apiData ? {
    items: apiData.items || [] as ApiUser[],
    pagination: {
      total: apiData.total || 0,
      page: apiData.page || filters.page || 1,
      limit: filters.limit || 10,
      totalPages: apiData.totalPages || 1
    }
  } : null;

  // Effect to update search filter
  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm, setSearch]);

  return (
    <div>
      <UserFilters
        filters={filters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        isFiltersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
      />

      <UserTable
        users={usersData?.items || []}
        isLoading={isLoading}
        isError={isError}
        onViewUser={(user) => {
          setSelectedUser(user);
          setIsViewOpen(true);
        }}
        onDeleteUser={(user) => {
          setSelectedUser(user);
          setIsDeleteOpen(true);
        }}
      />

      {usersData && (
        <UserPagination
          currentPage={filters.page || 1}
          totalPages={usersData.pagination.totalPages}
          pageSize={filters.limit || 10}
          totalItems={usersData.pagination.total}
          onPageChange={handlePageChange}
          onPageSizeChange={setLimit}
        />
      )}

      <ViewUserDialog
        user={selectedUser}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}