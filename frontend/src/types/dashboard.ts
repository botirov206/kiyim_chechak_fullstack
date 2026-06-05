import type { InventoryStatusSummary } from '@/types/inventory'

export interface RevenueMetrics {
  totalRevenue: number
  activeOrders: number
  orderCount: number
  averageOrderValue: number
  recentOrdersCount: number
}

export interface DashboardStats {
  totalOrders: number
  totalCustomers: number
  inventoryStatus: InventoryStatusSummary
  revenue: RevenueMetrics
}
