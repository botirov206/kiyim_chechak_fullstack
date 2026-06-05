import { useState } from 'react'
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
import { reportsApi } from '@/api/reports'
import type { Report } from '@/types/report'
import { formatDate } from '@/utils/format'

export function ReportsPage() {
  const query = usePaginatedQuery<Report>((params) => reportsApi.getAll(params), { page: 1, limit: 10 })

  const [generating, setGenerating] = useState<null | 'sales' | 'inventory'>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const generate = async (type: 'sales' | 'inventory') => {
    setGenerateError(null)
    setGenerating(type)
    try {
      if (type === 'sales') await reportsApi.generateSales()
      if (type === 'inventory') await reportsApi.generateInventory()
      await query.refetch()
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : 'Failed to generate report')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports"
        subtitle="Generate and track sales and inventory reports for wholesale operations."
      />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-[240px] flex-1">
            <label className="text-xs font-semibold text-white/60">Search</label>
            <Input
              className="mt-1"
              value={query.searchInput}
              onChange={(e) => query.setSearchInput(e.target.value)}
              placeholder="Title or description…"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              tone="secondary"
              disabled={generating !== null}
              onClick={() => void generate('sales')}
              leftIcon={generating === 'sales' ? <Spinner size={18} /> : null}
            >
              Generate Sales
            </Button>
            <Button
              tone="secondary"
              disabled={generating !== null}
              onClick={() => void generate('inventory')}
              leftIcon={generating === 'inventory' ? <Spinner size={18} /> : null}
            >
              Generate Inventory
            </Button>
            <Button tone="ghost" onClick={() => void query.refetch()}>
              Reload
            </Button>
          </div>
        </div>

        {generateError ? (
          <div className="mt-4">
            <Alert tone="error" title="Report generation failed">
              {generateError}
            </Alert>
          </div>
        ) : null}
      </Card>

      {query.isLoading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Spinner size={28} />
          </div>
          <div className="mt-3 text-center text-sm text-white/60">Loading reports…</div>
        </Card>
      ) : query.error ? (
        <Alert tone="error" title="Failed to load reports">
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
              { key: 'title', header: 'Title', cell: (r) => <div className="font-semibold">{r.title}</div> },
              { key: 'type', header: 'Type', cell: (r) => <span className="text-white/70">{r.type}</span> },
              {
                key: 'description',
                header: 'Description',
                cell: (r) => <span className="text-white/70">{r.description ?? '—'}</span>,
              },
              {
                key: 'generatedAt',
                header: 'Generated',
                cell: (r) => {
                  const generatedAt = r.data && 'generatedAt' in r.data ? String(r.data.generatedAt) : null
                  return <span className="text-white/70">{generatedAt ? formatDate(generatedAt) : '—'}</span>
                },
              },
              { key: 'createdAt', header: 'Created', cell: (r) => <span className="text-white/70">{formatDate(r.createdAt)}</span> },
            ]}
          />

          {!query.items.length ? <EmptyState title="No reports found" description="Generate a new report to get started." /> : null}

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

