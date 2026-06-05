import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonTone = 'primary' | 'secondary' | 'danger' | 'ghost'

const toneClasses: Record<ButtonTone, string> = {
  primary:
    'bg-brand-emerald-700 hover:bg-brand-emerald-800 text-white border-brand-emerald-800',
  secondary: 'bg-white/5 hover:bg-white/10 text-white border-white/10',
  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30',
  ghost: 'bg-transparent hover:bg-white/5 text-white border-white/10',
}

export function Button({
  tone = 'primary',
  leftIcon,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone
  leftIcon?: ReactNode
}) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        'focus-ring',
        toneClasses[tone],
        rest.disabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {leftIcon}
      {children}
    </button>
  )
}

