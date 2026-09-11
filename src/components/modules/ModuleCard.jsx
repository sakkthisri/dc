import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { CATEGORIES } from '../../data/categories';
import { getVisualizerComponent } from '../../visualizers/registry';

export function ModuleCard({ module }) {
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === module.category);
  const hasVisualizer = getVisualizerComponent(module.id) !== null;

  // Dynamic Lucide Icon lookup
  const IconComponent = Icons[module.icon] || Icons.Boxes;

  const handleClick = () => {
    navigate(`/module/${module.id}`);
  };

  const priorityLabel = {
    high: '🔴 HIGH PRIORITY',
    medium: '🟠 MEDIUM PRIORITY',
    low: '🟢 LOW PRIORITY'
  }[module.examPriority || 'medium'];

  return (
    <Card 
      onClick={handleClick}
      className="flex flex-col justify-between group hover:border-blue-500/40 relative overflow-hidden cursor-pointer"
    >
      {/* Top bar with category & Prominent Exam Priority Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-medium text-blue-400 dark:text-blue-400 light:text-blue-600 truncate max-w-[170px]">
            {category?.title || 'Distributed Computing'}
          </span>
          <div className="flex items-center gap-1.5">
            <Badge variant={module.examPriority || 'medium'} size="xs">
              {priorityLabel}
            </Badge>
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all duration-200">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base leading-snug group-hover:text-blue-400 transition-colors">
              {module.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {module.description}
        </p>
      </div>

      {/* Footer tags and action button */}
      <div>
        <div className="flex flex-wrap gap-1 mb-4">
          {module.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-[10px] px-2 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-gray-800 dark:bg-gray-800/80 dark:text-gray-400 light:bg-gray-100 light:text-gray-600 light:border-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button 
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-gray-800/90 text-gray-200 border border-gray-700/80 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-200 cursor-pointer"
        >
          <span>{hasVisualizer ? 'Open Visualizer' : 'Study Theory'}</span>
          <Icons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
}

export default ModuleCard;
