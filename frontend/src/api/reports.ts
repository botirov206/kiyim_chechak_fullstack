import { apiClient } from '@/api/client'
import type { PaginationParams } from '@/types/api'
import type { Report } from '@/types/report'
import type { ApiResponse } from '@/types/api'

export const reportsApi = {
  getAll(params?: PaginationParams) {
    return apiClient.getPaginated<Report>('/reports', params)
  },

  generateSales() {
    return apiClient
      .post<ApiResponse<Report>>('/reports/generate/sales')
      .then((response) => response.data)
  },

  generateInventory() {
    return apiClient
      .post<ApiResponse<Report>>('/reports/generate/inventory')
      .then((response) => response.data)
  },
}
