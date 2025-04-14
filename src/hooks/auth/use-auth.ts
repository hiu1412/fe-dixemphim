import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useLogin } from "./use-login";

export const useAuth = () => {
  const { user, isAuthenticated, logout: logoutFromStore } = useAuthStore();
  const login = useLogin();
  const router = useRouter();

  const logout = () => {
    logoutFromStore();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    router.push("/");
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};