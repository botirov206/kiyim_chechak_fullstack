import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import type { InventoryStatusSummary } from '@/types/inventory'

export function InventoryStatusCard({
  loading,
  error,
  data,
}: {
  loading: boolean
  error?: string | null
  data: InventoryStatusSummary | null
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white/70">Inventory Status</div>
          <div className="mt-1 text-xs text-white/50">Wholesale stock health across warehouses.</div>
        </div>
        {loading ? <Spinner size={26} /> : null}
      </div>

      {error ? <div className="mt-4 text-sm font-semibold text-red-300">{error}</div> : null}

      {!loading && !error && data ? (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Metric tone="primary" label="Total SKUs" value={data.totalItems} />
          <Metric tone="emerald" label="In Stock" value={data.inStock} />
          <Metric tone="amber" label="Low Stock" value={data.lowStock} />
          <Metric tone="red" label="Out of Stock" value={data.outOfStock} />
        </div>
      ) : null}
    </Card>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'primary' | 'emerald' | 'amber' | 'red'
}) {
  const toneClass =
    tone === 'emerald'
      ? 'text-emerald-300'
      : tone === 'amber'
        ? 'text-amber-300'
        : tone === 'red'
          ? 'text-red-300'
          : 'text-white'

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  )
}

