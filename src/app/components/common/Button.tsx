import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

const VARIANTS: Record<string, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus-visible:ring-indigo-500',
  danger:
    'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-600 focus-visible:ring-gray-400',
};

export function Button({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant] ?? VARIANTS.primary,
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
