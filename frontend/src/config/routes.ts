export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  customers: '/customers',
  inventory: '/inventory',
  orders: '/orders',
  warehouse: '/warehouse',
  reports: '/reports',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
