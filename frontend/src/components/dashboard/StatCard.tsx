import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'

export function StatCard({
  title,
  value,
  loading,
  error,
}: {
  title: string
  value: number | null
  loading: boolean
  error?: string | null
}) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-white/70">{title}</div>
      <div className="mt-3 flex items-center gap-3">
        {loading ? (
          <Spinner size={26} />
        ) : error ? (
          <div className="text-sm font-semibold text-red-300">{error}</div>
        ) : (
          <div className="text-3xl font-semibold text-white">{value ?? 0}</div>
        )}
      </div>
    </Card>
  )
}

