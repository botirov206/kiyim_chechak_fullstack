import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { RevenueMetrics } from '@/types/dashboard'

export function RevenueCards({
  loading,
  error,
  data,
}: {
  loading: boolean
  error?: string | null
  data: RevenueMetrics | null
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white/70">Revenue & Performance</div>
          <div className="mt-1 text-xs text-white/50">Tracks wholesale sales across orders.</div>
        </div>
        {loading ? <Spinner size={26} /> : null}
      </div>

      {error ? <div className="mt-4 text-sm font-semibold text-red-300">{error}</div> : null}

      {!loading && !error && data ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Metric
            label="Total Revenue"
            value={formatCurrency(data.totalRevenue)}
            tone="emerald"
          />
          <Metric label="Active Orders" value={formatNumber(data.activeOrders)} tone="primary" />
          <Metric
            label="Average Order Value"
            value={formatCurrency(data.averageOrderValue)}
            tone="gold"
          />
          <Metric
            label="Recent Orders"
            value={formatNumber(data.recentOrdersCount)}
            tone="primary"
          />
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
  value: string
  tone: 'primary' | 'emerald' | 'gold'
}) {
  const toneClass = tone === 'emerald' ? 'text-emerald-300' : tone === 'gold' ? 'text-brand-gold-700' : 'text-white'
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  )
}

