import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        warning:
          'border-transparent bg-yellow-500 text-yellow-500-foreground shadow hover:bg-yellow-500/80',
        info: 'border-transparent bg-blue-500 text-blue-500-foreground shadow hover:bg-blue-500/80',
        success:
          'border-transparent bg-green-500 text-green-500-foreground shadow hover:bg-green-500/80',
        danger:
          'border-transparent bg-red-500 text-red-500-foreground shadow hover:bg-red-500/80',
        light:
          'border-transparent bg-gray-500 text-gray-500-foreground shadow hover:bg-gray-500/80',
        dark: 'border-transparent bg-black text-black-foreground shadow hover:bg-black/80',
        muted:
          'border-transparent bg-muted text-muted-foreground shadow hover:bg-muted/80',
        subtle:
          'border-transparent bg-subtle text-subtle-foreground shadow hover:bg-subtle/80',
        'shade-success': 'border-green-500/10 bg-green-500/10 text-green-600',
        'shade-danger': 'border-red-500/10 bg-red-500/10 text-red-600',
        'shade-warning':
          'border-yellow-500/10 bg-yellow-500/10 text-yellow-600',
        'shade-info': 'border-blue-500/10 bg-blue-500/10 text-blue-600',
        'shade-purple': 'border-purple-500/10 bg-purple-500/10 text-purple-600',
        'shade-gray': 'border-gray-500/10 bg-gray-500/10 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
