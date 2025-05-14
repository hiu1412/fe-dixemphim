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

  //Movie
  MOVIES:{
    BASE: "/movie/",
    DETAIL: (id: string) => `/movie/${id}`,
    UPDATE: (id: string) => `/movie/${id}`,
    DELETE: (id: string) => `/movie/${id}`,
    CREATE: "/movie/",
    NEWEST: "/movie/newest",
  },

  SHOWTIMES:{
    BASE: "/showtime/",
    DETAIL: (id: string) => `/showtime/${id}`,
    UPDATE: (id: string) => `/showtime/${id}`,
    DELETE: (id: string) => `/showtime/${id}`,
    CREATE: "/showtime/",
  },

  SCREEN:{
    BASE: "/screen/",
    DETAIL: (id: string) => `/screen/${id}`,
    UPDATE: (id: string) => `/screen/${id}`,
    DELETE: (id: string) => `/screen/${id}`,
    CREATE: "/screen/",
  },
  
  SEAT:{
    BASE: "/seat/",
    DETAIL: (id: string) => `/seat/${id}`,
    UPDATE: (id: string) => `/seat/${id}`,
    DELETE: (id: string) => `/seat/${id}`,
    CREATE: "/seat/",
  },
  
  
}as const