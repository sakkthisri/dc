import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MODULES } from '../data/modules';
import { getModuleTheory } from '../data/moduleTheory';
import { UNITS } from '../data/units';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Filter 
} from 'lucide-react';

export function ExamRevisionPage() {
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('high'); // Default to High Priority

  const filteredModules = useMemo(() => {
    return MODULES.filter(m => {
      if (selectedUnit !== 'all' && m.unit !== selectedUnit) return false;
      if (m.examPriority !== priorityFilter) return false;
      return true;
    });
  }, [selectedUnit, priorityFilter]);

  const highCount = MODULES.filter(m => m.examPriority === 'high').length;
  const medCount = MODULES.filter(m => m.examPriority === 'medium').length;
  const lowCount = MODULES.filter(m => m.examPriority === 'low').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/80 via-gray-900 to-purple-950/80 border border-rose-800/50 shadow-2xl overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Exam Revision Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Distributed Computing <br />
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Exam Revision Mode
            </span>
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            Quickly revise core exam topics, review high-yield <strong>★ Exam Focus Points</strong>, and test yourself on <strong>Common Exam Questions</strong> before university examinations.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-200 text-xs font-bold">
              🔴 {highCount} High Priority Topics
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-900/60 border border-amber-700/60 text-amber-200 text-xs font-bold">
              🟠 {medCount} Medium Priority Topics
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs font-bold">
              🟢 {lowCount} Low Priority Topics
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-gray-900/80 border border-gray-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-rose-400" />
          <span>Revision Filter</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Unit Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedUnit === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Units
            </button>
            {UNITS.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedUnit === u.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Unit {u.unitNumber}
              </button>
            ))}
          </div>

          {/* Priority Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                priorityFilter === 'high' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              🔴 High Priority
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                priorityFilter === 'medium' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              🟠 Medium Priority
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                priorityFilter === 'low' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              🟢 Low Priority
            </button>
          </div>
        </div>
      </div>

      {/* Revision Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Showing <strong>{filteredModules.length}</strong> revision cards</span>
          <span>Click any card to open the interactive visualizer & full theory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredModules.map(module => {
            const theory = getModuleTheory(module);
            const priorityBadge = {
              high: '🔴 HIGH PRIORITY',
              medium: '🟠 MEDIUM PRIORITY',
              low: '🟢 LOW PRIORITY'
            }[module.examPriority || 'medium'];

            return (
              <Card 
                key={module.id} 
                className="p-6 flex flex-col justify-between space-y-4 hover:border-rose-500/40 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={module.examPriority || 'medium'} size="xs">
                      {priorityBadge}
                    </Badge>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Unit {module.unit === 'unit-1' ? '1' : module.unit === 'unit-2' ? '2' : '3'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                    {module.title}
                  </h3>

                  {/* Academic Definition */}
                  <p className="text-xs text-gray-300 bg-gray-950 p-3 rounded-xl border border-gray-800 leading-relaxed font-medium">
                    {theory.definition}
                  </p>

                  {/* ★ Exam Focus Points */}
                  <div className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block">
                      ★ EXAM FOCUS
                    </span>
                    <ul className="space-y-1">
                      {theory.examFocus.slice(0, 3).map((pt, idx) => (
                        <li key={idx} className="text-xs text-gray-200 flex items-start gap-1.5">
                          <span className="text-rose-400">&bull;</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Exam Questions */}
                  <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Typical Question
                    </span>
                    <p className="text-xs text-gray-300 font-mono italic">
                      {theory.commonQuestions[0] || "Explain the core protocol steps and architectural trade-offs."}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <Link
                  to={`/module/${module.id}`}
                  className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-rose-400 font-bold hover:text-rose-300 transition-colors"
                >
                  <span>Study Full Theory & Launch Visualizer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExamRevisionPage;
