import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { UserFilters, User, ApiResponse, UsersListResponse } from '@/lib/api/types';
import { toast } from "sonner"; // Thay đổi import từ useToast sang toast từ sonner

// Key cho cache queries
export const USER_QUERY_KEYS = {
  USERS: ['users'] as const,
  USER_FILTERS: (filters: UserFilters) => [...USER_QUERY_KEYS.USERS, 'filters', filters] as const,
  USER_DETAIL: (id: string) => [...USER_QUERY_KEYS.USERS, 'detail', id] as const,
};

// Lấy danh sách users với filters
export function useUserList(filters: UserFilters = {}) {
  return useQuery<UsersListResponse>({
    queryKey: USER_QUERY_KEYS.USER_FILTERS(filters),
    queryFn: async () => {
      const result = await adminApi.getUsers(filters);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

// Lấy thông tin chi tiết một user
export function useUser(userId: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.USER_DETAIL(userId),
    queryFn: () => adminApi.getUser(userId),
    enabled: !!userId,
  });
}

// Cập nhật thông tin user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<User> }) => 
      adminApi.updateUser(userId, userData),
    onSuccess: (data, { userId }) => {
      toast.success("Thành công", {
        description: "Thông tin người dùng đã được cập nhật"
      });
      
      // Invalidate queries để refresh data
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ 
        queryKey: USER_QUERY_KEYS.USER_DETAIL(userId)
      });
    },
    onError: (error: any) => {
      toast.error("Lỗi", {
        description: error.response?.data?.message || "Không thể cập nhật thông tin người dùng"
      });
    },
  });
}

// Cập nhật trạng thái active của user
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) => 
      adminApi.updateUser(userId, { active }),
    onSuccess: (data, { userId, active }) => {
      toast.success("Thành công", {
        description: `Người dùng đã được ${active ? 'kích hoạt' : 'khóa'}`
      });
      
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.USERS });
    },
    onError: (error: any) => {
      toast.error("Lỗi", {
        description: error.response?.data?.message || "Không thể thay đổi trạng thái người dùng"
      });
    },
  });
}

// Xóa user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success("Thành công", {
        description: "Người dùng đã được xóa"
      });
      
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.USERS });
    },
    onError: (error: any) => {
      toast.error("Lỗi", {
        description: error.response?.data?.message || "Không thể xóa người dùng"
      });
    },
  });
}