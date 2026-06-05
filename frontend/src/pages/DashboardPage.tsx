import { Alert } from '@/components/common/Alert'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { InventoryStatusCard } from '@/components/dashboard/InventoryStatusCard'
import { RevenueCards } from '@/components/dashboard/RevenueCards'
import { Button } from '@/components/common/Button'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export function DashboardPage() {
  const { data, error, isLoading, refetch } = useDashboardStats()

  const stats = data?.stats
  const errors = data?.errors

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="A real-time overview of your wholesale business operations."
        right={
          <Button tone="ghost" onClick={() => void refetch()}>
            Refresh
          </Button>
        }
      />

      {error ? (
        <Alert tone="error" title="Unable to load dashboard">
          {error}
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? null}
          loading={isLoading}
          error={errors?.totals ?? null}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers ?? null}
          loading={isLoading}
          error={errors?.totals ?? null}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <InventoryStatusCard
            loading={isLoading}
            error={errors?.inventoryStatus ?? null}
            data={stats?.inventoryStatus ?? null}
          />
        </div>
        <div className="lg:col-span-2">
          <RevenueCards
            loading={isLoading}
            error={errors?.revenue ?? null}
            data={stats?.revenue ?? null}
          />
        </div>
      </div>

    </div>
  )
}

