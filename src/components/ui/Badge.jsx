import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors';
  
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 light:bg-gray-100 light:text-gray-700 light:border-gray-300',
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400 light:bg-blue-50 light:text-blue-700 light:border-blue-200',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 light:bg-amber-50 light:text-amber-700 light:border-amber-200',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-400 light:bg-cyan-50 light:text-cyan-700 light:border-cyan-200',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-400 light:bg-purple-50 light:text-purple-700 light:border-purple-200',
    
    // Exam Priority specific
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200 font-bold',
    "high-priority": 'bg-rose-500/10 text-rose-400 border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400 light:bg-rose-50 light:text-rose-700 light:border-rose-200 font-bold',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 light:bg-amber-50 light:text-amber-700 light:border-amber-200 font-bold',
    "medium-priority": 'bg-amber-500/10 text-amber-400 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 light:bg-amber-50 light:text-amber-700 light:border-amber-200 font-bold',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200 font-medium',
    "low-priority": 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200 font-medium',

    // Status specific
    "available": 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
