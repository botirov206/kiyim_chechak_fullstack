import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/types/api'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseAsyncState<T> {
  data: T | null
  error: string | null
  status: AsyncStatus
  isLoading: boolean
}

interface UseAsyncOptions {
  immediate?: boolean
}

export const useAsync = <T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions = { immediate: true },
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
  })

  const asyncFnRef = useRef(asyncFn)
  asyncFnRef.current = asyncFn

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, status: 'loading', error: null }))

    try {
      const data = await asyncFnRef.current()
      setState({ data, error: null, status: 'success', isLoading: false })
      return data
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred'

      setState({ data: null, error: message, status: 'error', isLoading: false })
      return null
    }
  }, [])

  useEffect(() => {
    if (options.immediate) {
      void execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, options.immediate, ...deps])

  return { ...state, refetch: execute }
}
