import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="text-base font-semibold text-white">{title}</div>
      {description ? <div className="mt-1 text-sm text-white/70">{description}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

