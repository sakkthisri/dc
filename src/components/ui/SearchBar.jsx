import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';
import { MODULES } from '../../data/modules';
import { CATEGORIES } from '../../data/categories';
import { UNITS } from '../../data/units';
import { Badge } from './Badge';

export function SearchBar({ isOpen, onClose, placeholder = "Search visualizers, categories, tags..." }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return MODULES.filter(m => {
      const category = CATEGORIES.find(c => c.id === m.category);
      const unit = UNITS.find(u => u.id === m.unit);
      
      const titleMatch = m.title.toLowerCase().includes(q);
      const descMatch = m.description.toLowerCase().includes(q);
      const tagMatch = m.tags.some(t => t.toLowerCase().includes(q));
      const categoryMatch = category?.title.toLowerCase().includes(q);
      const unitMatch = unit?.title.toLowerCase().includes(q);

      return titleMatch || descMatch || tagMatch || categoryMatch || unitMatch;
    }).slice(0, 8);
  }, [query]);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (moduleId) => {
    navigate(`/module/${moduleId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-gray-950/80 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-gray-100 dark:text-gray-100 light:text-gray-900 placeholder-gray-500 focus:outline-none text-base"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-700 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded hover:bg-gray-700"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-500 light:text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
              <p className="text-sm font-medium">Search across 80+ Distributed Computing topics</p>
              <p className="text-xs text-gray-600 dark:text-gray-600 light:text-gray-400 mt-1">Try searching for "Paxos", "Lamport", "Raft", "MapReduce", "Kubernetes"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Matching Modules ({results.length})
              </div>
              {results.map((module) => {
                const category = CATEGORIES.find(c => c.id === module.category);
                const unit = UNITS.find(u => u.id === module.unit);
                return (
                  <div
                    key={module.id}
                    onClick={() => handleSelect(module.id)}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/30 border border-transparent cursor-pointer transition-all duration-150"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-100 dark:text-gray-100 light:text-gray-900 group-hover:text-blue-400 transition-colors">
                          {module.title}
                        </span>
                        <Badge variant={module.examPriority || 'medium'} size="xs">
                          {module.examPriority === 'high' ? '🔴 High Priority' : module.examPriority === 'low' ? '🟢 Low Priority' : '🟠 Medium Priority'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-1">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
                        <span className="text-blue-400 font-medium">Unit {unit?.unitNumber}</span>
                        <span>•</span>
                        <span className="truncate">{category?.title}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400 dark:text-gray-400 light:text-gray-600">
              <p className="text-sm font-semibold">No visualizers found.</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-400 mt-1">
                No topics matched "{query}". Try checking your spelling or adjusting filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
