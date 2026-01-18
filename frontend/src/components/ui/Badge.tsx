import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center',
        {
          'bg-emerald-500/20 text-emerald-400': variant === 'default' || variant === 'success' || variant === 'info',
          'bg-amber-500/20 text-amber-400': variant === 'warning',
          'bg-red-500/20 text-red-400': variant === 'error',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
