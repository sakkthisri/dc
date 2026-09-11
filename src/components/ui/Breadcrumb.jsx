import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 overflow-x-auto py-1">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-600 light:text-gray-400 shrink-0" />
            {isLast || !item.to ? (
              <span className="font-medium text-gray-200 dark:text-gray-200 light:text-gray-800 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.to} 
                className="hover:text-blue-400 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
