import { apiClient } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { Customer } from '@/types/customer'

export const customersApi = {
  getAll(params?: PaginationParams) {
    return apiClient.getPaginated<Customer>('/customers', params)
  },
}
