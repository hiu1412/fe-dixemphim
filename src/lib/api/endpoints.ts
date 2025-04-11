export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",  
      ME: "/auth/me",   
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
      CREATE: "/",
      NEWEST: "/movie/newest",
    },
  }as const