import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { UNITS } from '../../data/units';
import { CATEGORIES } from '../../data/categories';

export function FilterBar({ 
  filters, 
  onFilterChange, 
  onReset,
  showCategoryFilter = true,
  showUnitFilter = true,
  className = ''
}) {
  const categoriesForUnit = filters.unit 
    ? CATEGORIES.filter(c => c.unitId === filters.unit)
    : CATEGORIES;

  const hasActiveFilters = filters.unit || filters.category || filters.examPriority || filters.status;

  return (
    <div className={`bg-gray-900/60 border border-gray-800 rounded-xl p-4 backdrop-blur-sm dark:bg-gray-900/60 dark:border-gray-800 light:bg-white light:border-gray-200 light:shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filter Syllabus</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Exam Priority Filter (PRIMARY) */}
          <select
            value={filters.examPriority || ''}
            onChange={(e) => onFilterChange({ ...filters, examPriority: e.target.value || null })}
            className="bg-rose-950/40 border border-rose-700/60 text-rose-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-400"
          >
            <option value="" className="bg-gray-900 text-gray-200">All Exam Priorities</option>
            <option value="high" className="bg-gray-900 text-rose-400">🔴 High Priority</option>
            <option value="medium" className="bg-gray-900 text-amber-400">🟠 Medium Priority</option>
            <option value="low" className="bg-gray-900 text-emerald-400">🟢 Low Priority</option>
          </select>

          {/* Unit Filter */}
          {showUnitFilter && (
            <select
              value={filters.unit || ''}
              onChange={(e) => onFilterChange({ ...filters, unit: e.target.value || null, category: null })}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 light:bg-gray-100 light:border-gray-300 light:text-gray-800"
            >
              <option value="">All Units</option>
              {UNITS.map(u => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          {showCategoryFilter && (
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value || null })}
              className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 light:bg-gray-100 light:border-gray-300 light:text-gray-800 max-w-[200px] truncate"
            >
              <option value="">All Categories ({categoriesForUnit.length})</option>
              {categoriesForUnit.map(c => (
                <option key={c.id} value={c.id}>
                  Cat {c.categoryNumber}: {c.title}
                </option>
              ))}
            </select>
          )}

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
