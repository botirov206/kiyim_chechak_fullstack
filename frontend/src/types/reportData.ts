import type { InventoryItem } from '@/types/inventory'
import type { Order } from '@/types/order'

export interface SalesReportData {
  totalRevenue: string
  orderCount: number
  recentOrders: Order[]
  generatedAt: string
}

export interface InventoryReportData {
  totalItems: number
  warehouseCount: number
  productCount: number
  lowStockCount: number
  inventory: InventoryItem[]
  generatedAt: string
}

