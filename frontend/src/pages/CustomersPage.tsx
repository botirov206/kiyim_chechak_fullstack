import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { PaginationControls } from '@/components/common/PaginationControls'
import { PageHeader } from '@/components/common/PageHeader'
import { Spinner } from '@/components/common/Spinner'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { customersApi } from '@/api/customers'
import type { Customer } from '@/types/customer'
import { formatDate } from '@/utils/format'

export function CustomersPage() {
  const query = usePaginatedQuery<Customer>((params) => customersApi.getAll(params), { page: 1, limit: 10 })

  return (
    <div className="space-y-4">
      <PageHeader
        title="Customers"
        subtitle="Manage wholesale partners, pricing contacts, and account details."
      />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-[240px] flex-1">
            <label className="text-xs font-semibold text-white/60">Search</label>
            <Input
              className="mt-1"
              value={query.searchInput}
              onChange={(e) => query.setSearchInput(e.target.value)}
              placeholder="Name, email, company…"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button tone="secondary" onClick={() => void query.refetch()}>
              <span className="text-white/90">Reload</span>
            </Button>
          </div>
        </div>
      </Card>

      {query.isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Spinner size={28} />
          </div>
          <div className="mt-3 text-center text-sm text-white/60">Loading customers…</div>
        </Card>
      ) : query.error ? (
        <Alert tone="error" title="Failed to load customers">
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
            columns={[
              { key: 'name', header: 'Name', cell: (r) => <span className="font-semibold">{r.name}</span> },
              { key: 'email', header: 'Email', cell: (r) => <span className="text-white/70">{r.email ?? '—'}</span> },
              { key: 'company', header: 'Company', cell: (r) => <span className="text-white/70">{r.company ?? '—'}</span> },
              { key: 'phone', header: 'Phone', cell: (r) => <span className="text-white/70">{r.phone ?? '—'}</span> },
              {
                key: 'active',
                header: 'Status',
                cell: (r) => (
                  <span className={r.isActive ? 'text-emerald-300' : 'text-white/50'}>{r.isActive ? 'Active' : 'Inactive'}</span>
                ),
              },
              { key: 'createdAt', header: 'Created', cell: (r) => <span className="text-white/70">{formatDate(r.createdAt)}</span> },
            ]}
            getRowId={(r) => r.id}
          />

          {!query.items.length ? (
            <EmptyState title="No customers found" description="Try adjusting your search query." />
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

