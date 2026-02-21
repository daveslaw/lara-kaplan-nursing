'use client'

import { format } from 'date-fns'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <span className="text-sm text-muted-foreground hidden md:block">
          {format(new Date(), 'EEE, d MMM yyyy')}
        </span>
      </div>
    </div>
  )
}
