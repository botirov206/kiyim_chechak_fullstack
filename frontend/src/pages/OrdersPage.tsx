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
import { ordersApi } from '@/api/orders'
import type { Order } from '@/types/order'
import { formatCurrency, formatDate } from '@/utils/format'

export function OrdersPage() {
  const query = usePaginatedQuery<Order>((params) => ordersApi.getAll(params), { page: 1, limit: 10 })

  return (
    <div className="space-y-4">
      <PageHeader title="Orders" subtitle="Review wholesale orders and track fulfillment status." />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-[240px] flex-1">
            <label className="text-xs font-semibold text-white/60">Search</label>
            <Input
              className="mt-1"
              value={query.searchInput}
              onChange={(e) => query.setSearchInput(e.target.value)}
              placeholder="Order number or customer…"
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
          <div className="mt-3 text-center text-sm text-white/60">Loading orders…</div>
        </Card>
      ) : query.error ? (
        <Alert tone="error" title="Failed to load orders">
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
              {
                key: 'orderNumber',
                header: 'Order',
                cell: (r) => (
                  <div>
                    <div className="font-semibold">{r.orderNumber}</div>
                    <div className="text-xs text-white/60">{r.customer?.name ?? '—'}</div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                cell: (r) => (
                  <span
                    className={
                      r.status === 'CANCELLED'
                        ? 'text-red-300'
                        : r.status === 'DELIVERED'
                          ? 'text-emerald-300'
                          : 'text-amber-300'
                    }
                  >
                    {r.status}
                  </span>
                ),
              },
              {
                key: 'total',
                header: 'Total',
                cell: (r) => <span className="font-semibold">{formatCurrency(r.totalAmount)}</span>,
              },
              { key: 'createdAt', header: 'Created', cell: (r) => <span className="text-white/70">{formatDate(r.createdAt)}</span> },
            ]}
          />

          {!query.items.length ? (
            <EmptyState title="No orders found" description="Try adjusting your search query." />
          ) : null}

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

