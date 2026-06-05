import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import { EmptyState } from '@/components/common/EmptyState'
import { Input } from '@/components/common/Input'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PageHeader } from '@/components/common/PageHeader'
import { Spinner } from '@/components/common/Spinner'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { warehouseApi } from '@/api/warehouse'
import type { Warehouse } from '@/types/warehouse'
import { formatDate } from '@/utils/format'

export function WarehousePage() {
  const query = usePaginatedQuery<Warehouse>((params) => warehouseApi.getAll(params), { page: 1, limit: 10 })

  return (
    <div className="space-y-4">
      <PageHeader title="Warehouse" subtitle="Manage warehouse locations, capacity, and operational status." />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-[240px] flex-1">
            <label className="text-xs font-semibold text-white/60">Search</label>
            <Input
              className="mt-1"
              value={query.searchInput}
              onChange={(e) => query.setSearchInput(e.target.value)}
              placeholder="Name, code, location…"
            />
          </div>
          <Button tone="secondary" onClick={() => void query.refetch()}>
            Reload
          </Button>
        </div>
      </Card>

      {query.isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Spinner size={28} />
          </div>
          <div className="mt-3 text-center text-sm text-white/60">Loading warehouses…</div>
        </Card>
      ) : query.error ? (
        <Alert tone="error" title="Failed to load warehouses">
          {query.error}
          <div className="mt-3">
            <Button tone="ghost" onClick={() => void query.refetch()}>
              Retry
            </Button>
          </div>
        </Alert>
      ) : (
        <>
          <DataTable
            rows={query.items}
            getRowId={(r) => r.id}
            columns={[
              { key: 'name', header: 'Warehouse', cell: (r) => <div className="font-semibold">{r.name}</div> },
              { key: 'code', header: 'Code', cell: (r) => <span className="text-white/70">{r.code}</span> },
              { key: 'location', header: 'Location', cell: (r) => <span className="text-white/70">{r.location ?? '—'}</span> },
              { key: 'capacity', header: 'Capacity', cell: (r) => <span className="text-white/70">{r.capacity ?? '—'}</span> },
              {
                key: 'active',
                header: 'Status',
                cell: (r) => <span className={r.isActive ? 'text-emerald-300' : 'text-white/50'}>{r.isActive ? 'Active' : 'Inactive'}</span>,
              },
              { key: 'createdAt', header: 'Created', cell: (r) => <span className="text-white/70">{formatDate(r.createdAt)}</span> },
            ]}
          />

          {!query.items.length ? <EmptyState title="No warehouses found" description="Try adjusting your search query." /> : null}

          {query.pagination ? (
            <PaginationControls
              page={query.pagination.page}
              limit={query.pagination.limit}
              totalPages={query.pagination.totalPages}
              onPageChange={(p) => query.setPage(p)}
              onLimitChange={(l) => query.setLimit(l)}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

