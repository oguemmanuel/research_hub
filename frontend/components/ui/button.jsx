import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({ variant, size, className, children, isLoading, leftIcon, rightIcon, disabled, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variants = {
    primary: 'bg-blue-500 text-white border-transparent hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100',
    danger: 'bg-red-500 text-white border-transparent hover:bg-red-600',
  };
  const sizes = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  const styles = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button 
      className={styles} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
