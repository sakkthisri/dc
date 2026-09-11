import React from 'react';

export function Card({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  onClick,
  ...props 
}) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-gray-900/80 border border-gray-800/80 rounded-xl p-5 backdrop-blur-sm
        dark:bg-gray-900/80 dark:border-gray-800/80 dark:text-gray-100
        light:bg-white light:border-gray-200 light:text-gray-900 light:shadow-sm
        transition-all duration-200
        ${hover ? 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5' : ''}
        ${glow ? 'shadow-md shadow-blue-500/10 border-blue-500/30' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
