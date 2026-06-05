import { apiClient } from '@/api/client'
import type { AuthResponse, LoginCredentials, User } from '@/types/auth'
import type { ApiResponse } from '@/types/api'

export const authApi = {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient
      .post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      .then((response) => response.data)
  },

  getProfile(): Promise<User> {
    return apiClient.getData<User>('/auth/profile')
  },
}
