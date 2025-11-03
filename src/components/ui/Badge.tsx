import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const variantClass = {
      default: 'bg-gray-200 text-gray-900',
      primary: 'bg-blue-100 text-blue-900',
      success: 'bg-green-100 text-green-900',
      warning: 'bg-yellow-100 text-yellow-900',
      error: 'bg-red-100 text-red-900',
      info: 'bg-cyan-100 text-cyan-900',
    }[variant];

    const sizeClass = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }[size];

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass} ${className || ''}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
