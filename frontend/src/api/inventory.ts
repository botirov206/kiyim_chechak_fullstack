import { apiClient } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { InventoryItem } from '@/types/inventory'

export const inventoryApi = {
  getAll(params?: PaginationParams) {
    return apiClient.getPaginated<InventoryItem>('/inventory', params)
  },

  getLowStock() {
    return apiClient.getData<InventoryItem[]>('/inventory/low-stock')
  },
}
