import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { UNITS } from '../data/units';
import { getCategoriesByUnit } from '../data/categories';
import { getModulesByUnit, getModulesByCategory } from '../data/modules';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NotFound } from './NotFound';

export function UnitPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();

  // Support both "1" (number) and "unit-1" formats in URL
  const unit = UNITS.find(u => u.unitNumber === parseInt(unitId) || u.id === unitId);

  if (!unit) {
    return <NotFound title="Unit Not Found" description="The requested syllabus unit does not exist." />;
  }

  const categories = getCategoriesByUnit(unit.id);
  const modules = getModulesByUnit(unit.id);

  const IconComponent = Icons[unit.icon] || Icons.Boxes;

  const breadcrumbItems = [
    { label: `Unit ${unit.unitNumber}: ${unit.title}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Unit Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200 light:shadow-md">
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${unit.color}`} />
        
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                UNIT {unit.unitNumber}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">
                {unit.periods} Academic Periods
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 tracking-tight">
              {unit.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-3xl leading-relaxed">
              {unit.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-950/60 p-4 rounded-2xl border border-gray-800 shrink-0 dark:bg-gray-950/60 dark:border-gray-800 light:bg-gray-50 light:border-gray-200">
            <div className={`p-3.5 rounded-xl bg-gradient-to-br ${unit.color} text-white shadow-lg`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
                {modules.length} Topics
              </div>
              <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
                <span className="text-rose-400 font-bold">🔴 {modules.filter(m => m.examPriority === 'high').length} High</span>
                <span className="text-amber-400 font-bold">🟠 {modules.filter(m => m.examPriority === 'medium').length} Med</span>
                <span className="text-emerald-400 font-bold">🟢 {modules.filter(m => m.examPriority === 'low').length} Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Priority Breakdown Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="font-semibold text-rose-400">Exam Priority Coverage:</span>
            <span>{modules.filter(m => m.examPriority === 'high').length} High-Yield Exam Topics in Unit {unit.unitNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="high" size="xs">
              🔴 {modules.filter(m => m.examPriority === 'high').length} High Priority
            </Badge>
            <Badge variant="medium" size="xs">
              🟠 {modules.filter(m => m.examPriority === 'medium').length} Med Priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
            Categories in Unit {unit.unitNumber}
          </h2>
          <span className="text-xs text-gray-400">Select a category to view individual topics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => {
            const catModules = getModulesByCategory(category.id);
            const CatIcon = Icons[category.icon] || Icons.Boxes;

            return (
              <Card
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="flex flex-col justify-between group hover:border-blue-500/50 cursor-pointer p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      Category {category.categoryNumber}
                    </span>
                    <Badge variant="primary" size="xs">
                      {catModules.length} Modules
                    </Badge>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base group-hover:text-blue-400 transition-colors">
                      {category.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-800 dark:border-gray-800 light:border-gray-200 flex items-center justify-between text-xs font-medium text-blue-400 group-hover:text-blue-300">
                  <span>Browse Category Modules</span>
                  <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
