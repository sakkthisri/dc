import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  disabled = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm shadow-blue-500/20',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-700 light:bg-gray-100 light:hover:bg-gray-200 light:text-gray-800 light:border-gray-300',
    outline: 'border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 focus:ring-blue-500 dark:text-blue-400 light:text-blue-600 light:border-blue-400 light:hover:bg-blue-50',
    ghost: 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 dark:hover:bg-gray-800 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100',
    accent: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white focus:ring-cyan-500 shadow-md shadow-cyan-500/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
}
