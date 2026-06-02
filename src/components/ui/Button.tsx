'use client'
import { cn } from '@/lib/utils'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 font-montserrat font-medium tracking-widest uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-dark-900 text-cream-50 hover:bg-dark-800 active:scale-95',
    outline: 'border border-dark-900 text-dark-900 hover:bg-dark-900 hover:text-cream-50 active:scale-95',
    ghost: 'text-dark-900 hover:text-gold-600 active:scale-95',
  }
  const sizes = {
    sm: 'text-[10px] px-4 py-2',
    md: 'text-[11px] px-6 py-3',
    lg: 'text-[11px] px-8 py-4',
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
      {children}
    </button>
  )
}
