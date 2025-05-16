export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",  
    ME: "/auth/me",   
    GOOGLE_LOGIN: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    EMAIL_REQUEST:"/email/request-reset-password",
    EMAIL_RESET:(token: string) =>`/auth/reset-password/${token}`,
      },

  // User endpoints
  USERS: {
    BASE: "/user/",
    DETAIL: (id: string) => `/user/${id}`,
    UPDATE: (id: string) => `/user/${id}`,
    DELETE: (id: string) => `/user/${id}`,
  },

  PRODUCT: {
    BASE: "/product/",
    DETAIL: (id: string) => `/product/${id}`,
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
    CREATE: "/product/",
    LIST: "/product/",
    NEWEST: "/product/newest",
  }
  
}as const