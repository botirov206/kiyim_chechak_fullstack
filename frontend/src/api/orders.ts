import { apiClient } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { Order } from '@/types/order'

export const ordersApi = {
  getAll(params?: PaginationParams) {
    return apiClient.getPaginated<Order>('/orders', params)
  },
}
