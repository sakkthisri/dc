import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getCategoriesByUnit } from '../../data/categories';
import { getModulesByUnit } from '../../data/modules';

export function UnitCard({ unit }) {
  const navigate = useNavigate();
  const categories = getCategoriesByUnit(unit.id);
  const modules = getModulesByUnit(unit.id);

  const IconComponent = Icons[unit.icon] || Icons.Boxes;

  const handleClick = () => {
    navigate(`/unit/${unit.unitNumber}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-blue-500/50 dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 light:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${unit.color}`} />

      <div>
        {/* Header with Unit Number & Icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            UNIT {unit.unitNumber}
          </span>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${unit.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            <IconComponent className="w-6 h-6" />
          </div>
        </div>

        {/* Unit Title */}
        <h3 className="text-xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 mb-2 group-hover:text-blue-400 transition-colors">
          {unit.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-3 leading-relaxed mb-6">
          {unit.description}
        </p>
      </div>

      {/* Footer stats */}
      <div className="pt-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-2 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50">
            <div className="text-base font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">{unit.periods}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-400 light:text-gray-500">Periods</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50">
            <div className="text-base font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">{categories.length}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-400 light:text-gray-500">Categories</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50">
            <div className="text-base font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">{modules.length}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-400 light:text-gray-500">Modules</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
          <span>Explore Unit Syllabus</span>
          <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
