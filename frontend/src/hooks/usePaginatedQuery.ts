import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useAsync } from '@/hooks/useAsync'
import type { PaginatedResponse, PaginationParams } from '@/types/api'

export function usePaginatedQuery<T>(
  fetcher: (params: PaginationParams) => Promise<PaginatedResponse<T>>,
  initial: { page?: number; limit?: number } = {},
) {
  const [page, setPage] = useState(initial.page ?? 1)
  const [limit, setLimit] = useState(initial.limit ?? 10)
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearch = useDebounce(searchInput, 400)

  const queryParams: PaginationParams = {
    page,
    limit,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
  }

  const { data, error, isLoading, status, refetch } = useAsync(() => fetcher(queryParams), [
    page,
    limit,
    debouncedSearch,
  ])

  return {
    items: data?.data ?? [],
    pagination: data?.pagination ?? null,
    page,
    limit,
    searchInput,
    setSearchInput,
    setPage,
    setLimit,
    isLoading,
    status,
    error,
    refetch,
  }
}

