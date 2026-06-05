import { useAsync } from '@/hooks/useAsync'
import { ordersApi } from '@/api/orders'
import { customersApi } from '@/api/customers'
import { inventoryApi } from '@/api/inventory'
import { reportsApi } from '@/api/reports'
import type { DashboardStats } from '@/types/dashboard'
import type { InventoryStatusSummary, InventoryItem } from '@/types/inventory'
import type { RevenueMetrics } from '@/types/dashboard'
import type { Order } from '@/types/order'
import type { SalesReportData, InventoryReportData } from '@/types/reportData'

const parseDecimal = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const computeInventoryStatusFromItems = (items: InventoryItem[]): InventoryStatusSummary => {
  const totalItems = items.length
  let inStock = 0
  let lowStock = 0
  let outOfStock = 0

  for (const item of items) {
    if (item.quantity <= 0) {
      outOfStock += 1
    } else if (item.quantity <= item.minStock) {
      lowStock += 1
    } else {
      inStock += 1
    }
  }

  return { totalItems, inStock, lowStock, outOfStock }
}

const computeRevenueFromOrders = (orders: Order[]) => {
  let totalRevenue = 0
  let activeOrders = 0

  for (const order of orders) {
    if (order.status === 'CANCELLED') continue
    activeOrders += 1
    totalRevenue += parseDecimal(order.totalAmount)
  }

  const orderCount = activeOrders
  const averageOrderValue = activeOrders > 0 ? totalRevenue / activeOrders : 0

  return {
    totalRevenue,
    activeOrders,
    orderCount,
    averageOrderValue,
    recentOrdersCount: Math.min(5, activeOrders),
  } satisfies RevenueMetrics
}

const fetchAllOrders = async (limit = 50): Promise<Order[]> => {
  const first = await ordersApi.getAll({ page: 1, limit: 1 })
  const totalPages = first.pagination.totalPages

  const pages: number[] = []
  for (let p = 1; p <= totalPages; p += 1) pages.push(p)

  const results = await Promise.all(
    pages.map((p) => ordersApi.getAll({ page: p, limit }).then((r) => r.data)),
  )

  return results.flat()
}

const fetchInventoryAllItems = async (limit = 50): Promise<InventoryItem[]> => {
  const first = await inventoryApi.getAll({ page: 1, limit: 1 })
  const totalPages = first.pagination.totalPages

  const pages: number[] = []
  for (let p = 1; p <= totalPages; p += 1) pages.push(p)

  const results = await Promise.all(
    pages.map((p) => inventoryApi.getAll({ page: p, limit }).then((r) => r.data)),
  )

  return results.flat()
}

export const useDashboardStats = () => {
  return useAsync(
    async () => {
      const errors: {
        totals?: string
        inventoryStatus?: string
        revenue?: string
      } = {}

      let totalOrders: number | null = null
      let totalCustomers: number | null = null
      let inventoryStatus: InventoryStatusSummary | null = null
      let revenue: RevenueMetrics | null = null

      try {
        const [ordersRes, customersRes] = await Promise.all([
          ordersApi.getAll({ page: 1, limit: 1 }),
          customersApi.getAll({ page: 1, limit: 1 }),
        ])
        totalOrders = ordersRes.pagination.total
        totalCustomers = customersRes.pagination.total
      } catch (e) {
        errors.totals = e instanceof Error ? e.message : 'Failed to load totals'
      }

      // Inventory status
      try {
        const report = await reportsApi.generateInventory()
        const data = report.data as InventoryReportData | null
        if (data) {
          inventoryStatus = {
            totalItems: data.totalItems,
            inStock: data.inventory.filter((i) => i.quantity > i.minStock).length,
            lowStock: data.inventory.filter((i) => i.quantity > 0 && i.quantity <= i.minStock).length,
            outOfStock: data.inventory.filter((i) => i.quantity <= 0).length,
          }
        }
      } catch {
        try {
          const allInventory = await fetchInventoryAllItems()
          inventoryStatus = computeInventoryStatusFromItems(allInventory)
        } catch (inner) {
          errors.inventoryStatus = inner instanceof Error ? inner.message : 'Failed to compute inventory status'
        }
      }

      // Revenue metrics
      try {
        const report = await reportsApi.generateSales()
        const data = report.data as SalesReportData | null
        if (data) {
          const totalRevenue = parseDecimal(data.totalRevenue)
          const activeOrders = data.orderCount
          revenue = {
            totalRevenue,
            activeOrders,
            orderCount: activeOrders,
            averageOrderValue: activeOrders > 0 ? totalRevenue / activeOrders : 0,
            recentOrdersCount: data.recentOrders.filter((o) => o.status !== 'CANCELLED').length,
          }
        }
      } catch {
        try {
          const allOrders = await fetchAllOrders()
          revenue = computeRevenueFromOrders(allOrders)
        } catch (inner) {
          errors.revenue = inner instanceof Error ? inner.message : 'Failed to compute revenue metrics'
        }
      }

      const stats: DashboardStats = {
        totalOrders: totalOrders ?? 0,
        totalCustomers: totalCustomers ?? 0,
        inventoryStatus: inventoryStatus ?? {
          totalItems: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
        },
        revenue: revenue ?? {
          totalRevenue: 0,
          activeOrders: 0,
          orderCount: 0,
          averageOrderValue: 0,
          recentOrdersCount: 0,
        },
      }

      return { stats, errors }
    },
    [],
    { immediate: true },
  )
}

