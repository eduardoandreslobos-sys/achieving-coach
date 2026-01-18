'use client';

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-gray-500 text-xs tracking-wider uppercase mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3',
              'text-white dark:text-white placeholder-gray-500',
              'focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50',
              'transition-colors',
              icon && 'pr-10',
              error && 'border-red-500/50',
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
