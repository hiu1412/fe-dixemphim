import { create } from "zustand";
import { User } from "@/lib/api/types";

interface AuthStore {
  user: User | null;
  accessToken: string | null;//lưu accessToken là một trường riêng
  isAuthenticated: boolean;
  setUser: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setUser: (user, accessToken, refreshToken) => {
    // Lưu token vào localStorage và cookies
    if (typeof window !== 'undefined') {
      // localStorage.setItem('accessToken', accessToken);
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
      document.cookie = `user-role=${user.role || 'user'}; path=/; max-age=${30 * 24 * 60 * 60}`;
    }

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    // Xóa tokens và cookies
    if (typeof window !== 'undefined') {
      // localStorage.removeItem('accessToken');
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));

//