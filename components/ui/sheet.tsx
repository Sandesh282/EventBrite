import * as React from 'react'
import { cn } from '@/lib/utils'

interface SheetProps { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }
export function Sheet({ children, open }: SheetProps) { return open ? <>{children}</> : null }
export function SheetContent({ children, className, side: _s, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: string }) {
  return <div className={cn('fixed inset-y-0 right-0 z-50 w-72 bg-background p-6 shadow-lg', className)} {...props}>{children}</div>
}
export function SheetHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2', className)} {...props}>{children}</div>
}
export function SheetTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props}>{children}</h2>
}
export function SheetDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props}>{children}</p>
}
