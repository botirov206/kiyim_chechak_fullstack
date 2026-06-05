import { apiClient } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { Warehouse } from '@/types/warehouse'

export const warehouseApi = {
  getAll(params?: PaginationParams) {
    return apiClient.getPaginated<Warehouse>('/warehouses', params)
  },
}
