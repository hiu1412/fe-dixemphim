import { create } from 'zustand';
import {User} from '@/lib/api/types';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User, accessToken: string) => void;
    logout: () => void;
  }

  export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user, accessToken) => {
      // Lưu access token vào localStorage
      localStorage.setItem("accessToken", accessToken);
  
      set({
        user,
        isAuthenticated: true,
      });
    },
    logout: () => {
      // Xóa access token khỏi localStorage
      localStorage.removeItem("accessToken");
      
      set({
        user: null,
        isAuthenticated: false,
      });
    },
  }));