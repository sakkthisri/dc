import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { UNITS } from '../data/units';
import { getModulesByCategory } from '../data/modules';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ModuleGrid } from '../components/modules/ModuleGrid';
import { FilterBar } from '../components/ui/FilterBar';
import { Search } from 'lucide-react';
import { NotFound } from './NotFound';

export function CategoryPage() {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ examPriority: null, status: null });

  const category = CATEGORIES.find(c => c.id === categoryId);
  const unit = UNITS.find(u => u.id === category?.unitId);

  // Filter & Search computation with correct dependencies
  const { allCategoryModules, filteredModules } = useMemo(() => {
    if (!category) return { allCategoryModules: [], filteredModules: [] };
    const allMods = getModulesByCategory(category.id);
    const filtered = allMods.filter(m => {
      if (filters.examPriority && m.examPriority !== filters.examPriority) return false;
      if (filters.status && m.status !== filters.status) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = m.title.toLowerCase().includes(q);
        const descMatch = m.description.toLowerCase().includes(q);
        const tagMatch = m.tags.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }

      return true;
    });

    return { allCategoryModules: allMods, filteredModules: filtered };
  }, [category, filters, searchTerm]);

  if (!category) {
    return <NotFound title="Category Not Found" description="The requested category does not exist." />;
  }

  const CatIcon = Icons[category.icon] || Icons.Boxes;

  const breadcrumbItems = [
    { label: `Unit ${unit?.unitNumber}: ${unit?.title}`, to: `/unit/${unit?.unitNumber}` },
    { label: category.title }
  ];

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({ examPriority: null, status: null });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Category Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200 light:shadow-md">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                CATEGORY {category.categoryNumber}
              </span>
              <span className="text-xs text-gray-400">
                Unit {unit?.unitNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 tracking-tight">
              {category.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-3xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 self-start sm:self-center">
            <CatIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* In-category Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search input within category */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search within ${category.title}...`}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-300 light:text-gray-900"
          />
        </div>

        {/* Filter dropdown bar */}
        <FilterBar 
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          showUnitFilter={false}
          showCategoryFilter={false}
        />
      </div>

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Syllabus Topics ({filteredModules.length} of {allCategoryModules.length})
          </h2>
        </div>

        <ModuleGrid 
          modules={filteredModules}
          onResetFilters={handleResetFilters}
        />
      </div>

    </div>
  );
}
