import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({ 
  title = "No visualizers found", 
  description = "No topics matched your search criteria or active filters.",
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/40 dark:border-gray-800 light:border-gray-300 light:bg-gray-50/50">
      <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-200 dark:text-gray-200 light:text-gray-800 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-md mb-6">
        {description}
      </p>
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Search & Filters
        </Button>
      )}
    </div>
  );
}
