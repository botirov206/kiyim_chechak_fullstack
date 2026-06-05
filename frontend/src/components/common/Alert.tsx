import type { ReactNode } from 'react'

type AlertTone = 'error' | 'info' | 'success' | 'warning'

const toneToStyles: Record<AlertTone, string> = {
  error: 'bg-red-500/10 text-red-300 border-red-500/30',
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
}

export function Alert({
  tone = 'info',
  title,
  children,
}: {
  tone?: AlertTone
  title?: string
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${toneToStyles[tone]}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

