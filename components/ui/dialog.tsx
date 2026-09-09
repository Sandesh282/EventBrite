import * as React from 'react'
import { cn } from '@/lib/utils'

interface DialogProps { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }
export function Dialog({ children, open }: DialogProps) { return open ? <div>{children}</div> : null }
export function DialogContent({ children, className, showCloseButton: _s, ...props }: React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  return <div role="dialog" className={cn('fixed inset-0 z-50 flex items-center justify-center', className)} {...props}>{children}</div>
}
export function DialogHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5', className)} {...props}>{children}</div>
}
export function DialogTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props}>{children}</h2>
}
export function DialogDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props}>{children}</p>
}
