import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Network, 
  Info, 
  Sun, 
  Moon, 
  ChevronDown, 
  ChevronRight,
  X,
  Compass,
  ArrowRightLeft,
  BookOpen,
  UserCheck,
  Activity,
  Sparkles
} from 'lucide-react';
import { UNITS } from '../../data/units';
import { CATEGORIES } from '../../data/categories';
import { getModulesByUnit } from '../../data/modules';

export function Sidebar({ isMobileOpen, onCloseMobile, theme, toggleTheme }) {
  const location = useLocation();
  const [openUnits, setOpenUnits] = useState({ 'unit-1': true, 'unit-2': false, 'unit-3': false });

  const toggleUnitAccordion = (unitId) => {
    setOpenUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`
        fixed top-0 bottom-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 flex flex-col justify-between transition-transform duration-300 ease-in-out
        dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Sidebar Header / Logo */}
      <div className="p-5 border-b border-gray-800 dark:border-gray-800 light:border-gray-200 flex items-center justify-between">
        <Link to="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-sm text-gray-100 dark:text-gray-100 light:text-gray-900 leading-none tracking-tight">
              DISTRIBUTED
            </div>
            <div className="font-semibold text-xs text-blue-400 dark:text-blue-400 light:text-blue-600 tracking-wider">
              VISUALIZER
            </div>
          </div>
        </Link>

        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Main Links */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-400 light:text-gray-500 uppercase tracking-widest">
            Main Menu
          </div>
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800/70 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 dark:hover:bg-gray-800/70 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About Project</span>
            </Link>
          </nav>
        </div>

        {/* Learning Hub Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-400 light:text-gray-500 uppercase tracking-widest">
            Learning Hub
          </div>
          <nav className="space-y-1">
            <Link
              to="/revision"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                isActive('/revision') 
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/30' 
                  : 'text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Exam Revision Mode</span>
            </Link>

            <Link
              to="/learning-paths"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/learning-paths') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Guided Paths</span>
            </Link>

            <Link
              to="/comparisons"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/comparisons') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
              <span>Algorithm Matrix</span>
            </Link>

            <Link
              to="/glossary"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/glossary') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Subject Glossary</span>
            </Link>

            <Link
              to="/my-learning"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/my-learning') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>My Progress & Notes</span>
            </Link>

            <Link
              to="/audit"
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/audit') 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                  : 'text-gray-300 hover:bg-gray-800/70 hover:text-white dark:text-gray-300 light:text-gray-700 light:hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-400" />
              <span>System Audit</span>
            </Link>
          </nav>
        </div>

        {/* Syllabus Units Accordion */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-400 light:text-gray-500 uppercase tracking-widest">
            Syllabus Units
          </div>
          <div className="space-y-1">
            {UNITS.map(unit => {
              const isOpen = openUnits[unit.id];
              const categories = CATEGORIES.filter(c => c.unitId === unit.id);
              const modulesCount = getModulesByUnit(unit.id).length;
              const isUnitActive = location.pathname === `/unit/${unit.unitNumber}`;

              return (
                <div key={unit.id} className="rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/unit/${unit.unitNumber}`}
                      onClick={onCloseMobile}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-l-xl transition-colors ${
                        isUnitActive 
                          ? 'text-blue-400 bg-blue-500/10' 
                          : 'text-gray-200 hover:text-blue-400 dark:text-gray-200 light:text-gray-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="truncate">Unit {unit.unitNumber}</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 dark:bg-gray-800 light:bg-gray-200">
                        {modulesCount}
                      </span>
                    </Link>
                    <button
                      onClick={() => toggleUnitAccordion(unit.id)}
                      className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-r-xl transition-colors"
                    >
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Categories */}
                  {isOpen && (
                    <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-gray-800 dark:border-gray-800 light:border-gray-200 my-1 ml-4">
                      {categories.map(cat => {
                        const isCatActive = location.pathname === `/category/${cat.id}`;
                        return (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={onCloseMobile}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors truncate ${
                              isCatActive
                                ? 'bg-blue-600/15 text-blue-400 font-semibold'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 dark:text-gray-400 light:text-gray-600 light:hover:bg-gray-100'
                            }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className="truncate">{cat.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sidebar Footer Theme Toggle & Info */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-xs font-medium text-gray-300 dark:bg-gray-800/80 dark:text-gray-300 light:bg-gray-100 light:text-gray-800 light:hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-500">Toggle</span>
        </button>
      </div>
    </aside>
  );
}
