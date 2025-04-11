import { useAuthStore } from '@/store/use-auth-store';

export const USE_CURRENT_USER_QUERY_KEY = ["current-user"] as const;

export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return {
    data: {
      data: {
        user,
      }
    },
    isAuthenticated,
    isLoading: false,
    error: null
  };
};
