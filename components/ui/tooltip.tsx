import * as React from 'react'
import { cn } from '@/lib/utils'

export function TooltipProvider({ children, delayDuration: _d, ...props }: React.HTMLAttributes<HTMLDivElement> & { delayDuration?: number }) {
  return <>{children}</>
}
export function Tooltip({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <>{children}</>
}
export function TooltipTrigger({ children, asChild: _a, ...props }: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) {
  return <span {...props}>{children}</span>
}
export function TooltipContent({ children, className, side: _s, align: _al, hidden: _h, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: string; align?: string; hidden?: boolean }) {
  return (
    <div className={cn('z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md', className)} {...props}>
      {children}
    </div>
  )
}
