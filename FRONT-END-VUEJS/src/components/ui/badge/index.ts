import { type VariantProps, cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        secondary:
          'border-muted-border bg-muted-background text-muted-border hover:bg-secondary-foreground/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        destructive:
          'border-red bg-red-foreground text-red shadow hover:bg-red-foreground/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
        success:
          'border-green bg-green-foreground text-green shadow hover:bg-green-foreground/80 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/80',
        primary:
          'border-primary/30 bg-primary/5 text-primary shadow hover:bg-primary-foreground/80 dark:bg-primary-900 dark:text-slate-50 dark:hover:bg-primary-900/80',

      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
