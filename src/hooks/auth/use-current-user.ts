import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store";
import { useMemo, useRef } from "react";
import authService from "@/lib/api/services/auth-service";


export const USE_CURRENT_USER_QUERY_KEY = ["current-user"] as const;


export const useCurrentUser = () => {
// Lấy trực tiếp các hàm và state từ store
const setUser = useAuthStore((state) => state.setUser);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const user = useAuthStore((state) => state.user);

// Để tránh gọi API nhiều lần khi dùng StrictMode
const hasFetchedRef = useRef(false);

// Kiểm tra token từ localStorage một lần
const hasToken = useMemo(() => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem("accessToken");
}, []);

// Memoize kết quả của điều kiện enabled để tránh tính toán lại
const isQueryEnabled = useMemo(() => {
  // Chỉ fetch nếu:
  // 1. Có token
  // 2. Chưa authenticated hoặc chưa có user
  // 3. Chưa từng fetch thành công (trong StrictMode)
  return hasToken && !user && !isAuthenticated && !hasFetchedRef.current;
}, [hasToken, user, isAuthenticated]);

const query = useQuery({
  queryKey: USE_CURRENT_USER_QUERY_KEY,
  queryFn: async () => {
    console.log("Fetching current user...");
    const response = await authService.getMe();
    return response.data;
  },
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000, // 5 phút
  // Chỉ fetch dữ liệu nếu có token và chưa có user data
  enabled: isQueryEnabled,
  select: (data) => {
    if (data?.user) {
      setUser(data.user, localStorage.getItem("accessToken") || "");
      // Đánh dấu đã fetch thành công để tránh fetch lại trong StrictMode
      hasFetchedRef.current = true;
    }
    return data?.user;
  },
});

return query;
};

export type UseCurrentUserReturn = ReturnType<typeof useCurrentUser>;