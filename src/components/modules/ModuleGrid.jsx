import React from 'react';
import { ModuleCard } from './ModuleCard';
import { EmptyState } from '../ui/EmptyState';

export function ModuleGrid({ modules = [], onResetFilters }) {
  if (modules.length === 0) {
    return (
      <EmptyState 
        title="No modules match your criteria"
        description="Try adjusting your active search terms or filters to explore other syllabus topics."
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}
