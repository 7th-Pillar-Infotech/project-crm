import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', className, ...props }, ref) => {
    const paddingClass = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }[padding];

    const variantClass = {
      default: 'bg-white rounded-lg shadow-sm',
      outlined: 'bg-white rounded-lg border border-gray-200',
      elevated: 'bg-white rounded-lg shadow-md',
    }[variant];

    return (
      <div
        ref={ref}
        className={`${variantClass} ${paddingClass} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
