import type { InputHTMLAttributes } from 'react'

export function Input({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40',
        'focus:border-brand-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald-700/40',
        className,
      ].join(' ')}
    />
  )
}

