export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",     
        },
  
    // User endpoints
    USERS: {
      BASE: "/users",
      DETAIL: (id: number) => `/user/${id}`,
      UPDATE: (id: number) => `/user/${id}`,
      DELETE: (id: number) => `/user/${id}`,
    },

    //Movie
    BASE: "/movies",
    DETAIL: (id: number) => `/movie/${id}`,
    UPDATE: (id: number) => `/movie/${id}`,
    DELETE: (id: number) => `/movie/${id}`,
    CREATE: "/",
    NEWEST: "/",
  }as const