import type { ChangeEvent } from 'react'

export function PaginationControls({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: {
  page: number
  limit: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}) {
  const canPrev = page > 1
  const canNext = page < totalPages

  const handleLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = Number.parseInt(e.target.value, 10)
    if (Number.isFinite(next) && onLimitChange) onLimitChange(next)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>
          Page <span className="font-semibold text-white">{page}</span> of{' '}
          <span className="font-semibold text-white">{totalPages}</span>
        </span>
        {onLimitChange ? (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={limit}
              onChange={handleLimit}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white/90"
            >
              {[10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  )
}

