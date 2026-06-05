import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  Home,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
}

const baseLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
    isActive
      ? 'border-brand-emerald-700/60 bg-brand-emerald-700/10 text-white'
      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
  ].join(' ')

export function SidebarNav({
  items,
}: {
  items: NavItem[]
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }: { isActive: boolean }) => baseLinkClass({ isActive })}
        >
          <span className="text-white/80">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function buildDefaultNavItems({
  getIconProps,
}: {
  getIconProps?: () => Record<string, unknown>
} = {}) {
  const iconProps = getIconProps?.() ?? {}
  return [
    { to: ROUTES.dashboard, label: 'Dashboard', icon: <Home size={18} {...iconProps} /> },
    { to: ROUTES.customers, label: 'Customers', icon: <Users size={18} {...iconProps} /> },
    { to: ROUTES.inventory, label: 'Inventory', icon: <Boxes size={18} {...iconProps} /> },
    { to: ROUTES.orders, label: 'Orders', icon: <ClipboardList size={18} {...iconProps} /> },
    { to: ROUTES.warehouse, label: 'Warehouse', icon: <Building2 size={18} {...iconProps} /> },
    { to: ROUTES.reports, label: 'Reports', icon: <BarChart3 size={18} {...iconProps} /> },
  ] as NavItem[]
}

