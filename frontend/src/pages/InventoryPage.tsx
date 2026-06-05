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
import { inventoryApi } from '@/api/inventory'
import type { InventoryItem } from '@/types/inventory'
import { formatDate } from '@/utils/format'

export function InventoryPage() {
  const query = usePaginatedQuery<InventoryItem>((params) => inventoryApi.getAll(params), { page: 1, limit: 10 })

  return (
    <div className="space-y-4">
      <PageHeader title="Inventory" subtitle="Track stock levels across warehouses and wholesale SKUs." />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-[240px] flex-1">
            <label className="text-xs font-semibold text-white/60">Search</label>
            <Input
              className="mt-1"
              value={query.searchInput}
              onChange={(e) => query.setSearchInput(e.target.value)}
              placeholder="Product name, warehouse…"
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
          <div className="mt-3 text-center text-sm text-white/60">Loading inventory…</div>
        </Card>
      ) : query.error ? (
        <Alert tone="error" title="Failed to load inventory">
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
              { key: 'product', header: 'Product', cell: (r) => <div><div className="font-semibold">{r.product.name}</div><div className="text-xs text-white/60">SKU {r.product.sku}</div></div> },
              { key: 'warehouse', header: 'Warehouse', cell: (r) => <span className="text-white/70">{r.warehouse.code}</span> },
              { key: 'qty', header: 'Quantity', cell: (r) => <span className={r.quantity <= 0 ? 'text-red-300' : r.quantity <= r.minStock ? 'text-amber-300' : 'text-emerald-300'}>{r.quantity}</span> },
              { key: 'minStock', header: 'Min Stock', cell: (r) => <span className="text-white/70">{r.minStock}</span> },
              {
                key: 'health',
                header: 'Health',
                cell: (r) => {
                  if (r.quantity <= 0) return <span className="text-red-300">Out of stock</span>
                  if (r.quantity <= r.minStock) return <span className="text-amber-300">Low stock</span>
                  return <span className="text-emerald-300">Healthy</span>
                },
              },
              { key: 'updatedAt', header: 'Updated', cell: (r) => <span className="text-white/70">{formatDate(r.updatedAt)}</span> },
            ]}
          />

          {!query.items.length ? (
            <EmptyState title="No inventory records" description="Try adjusting your search query." />
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

