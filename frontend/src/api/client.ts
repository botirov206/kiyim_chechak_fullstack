import { env } from '@/config/env'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import { ApiError } from '@/types/api'
import { storage } from '@/utils/storage'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  params?: PaginationParams
}

const buildUrl = (path: string, params?: PaginationParams): string => {
  const base = env.apiUrl.startsWith('/')
    ? new URL(env.apiUrl, window.location.origin)
    : new URL(env.apiUrl)

  const url = new URL(`${base.pathname.replace(/\/$/, '')}${path}`, base.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

const parseErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = (payload as { message: unknown }).message
    if (typeof message === 'string') return message
  }

  return fallback
}

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers, ...rest } = options
    const token = storage.getToken()

    const response = await fetch(buildUrl(path, params), {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    const payload: unknown = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        parseErrorMessage(payload, `Request failed with status ${response.status}`),
        response.status,
        payload,
      )
    }

    return payload as T
  },

  get<T>(path: string, params?: PaginationParams): Promise<T> {
    return this.request<T>(path, { method: 'GET', params })
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body })
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body })
  },

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  },

  async getData<T>(path: string, params?: PaginationParams): Promise<T> {
    const response = await this.get<ApiResponse<T>>(path, params)
    return response.data
  },

  async getPaginated<T>(path: string, params?: PaginationParams): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(path, params)
  },
}
