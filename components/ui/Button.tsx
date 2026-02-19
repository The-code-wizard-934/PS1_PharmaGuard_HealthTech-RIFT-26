
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variantClasses = {
    default: 'bg-cyan-600 text-white hover:bg-cyan-700/90',
    outline: 'border border-cyan-600 bg-transparent hover:bg-cyan-100 dark:hover:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} px-4 py-2 ${className}`}
      {...props}
    />
  );
};
