export const API_ENDPOINTS = {
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  DISHES: {
    BASE: '/dishes',
    BY_ID: (id: number) => `/dishes/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: number) => `/orders/${id}`,
  },
  RESTAURANTS: {
    BASE: '/restaurants',
    BY_ID: (id: number) => `/restaurants/${id}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
  },
};
