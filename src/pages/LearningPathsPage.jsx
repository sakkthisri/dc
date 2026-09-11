import React from 'react';
import { Link } from 'react-router-dom';
import { LEARNING_PATHS } from '../data/learningPaths';
import { MODULES } from '../data/modules';
import { useUserProgress } from '../hooks/useUserProgress';
import { CheckCircle2, Circle, ArrowRight, Compass } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function LearningPathsPage() {
  const { isCompleted } = useUserProgress();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950/80 via-gray-900 to-indigo-950/80 border border-blue-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-700/50 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Guided Curriculum Paths</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Distributed Computing Guided Learning Paths
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Follow structured unit-by-unit curricula curated specifically for university syllabus alignment. Track your completion progress as you master consensus, storage, cloud, and edge systems.
          </p>
        </div>
      </div>

      {/* Path Cards */}
      <div className="space-y-8">
        {LEARNING_PATHS.map(path => {
          const pathModules = path.modules.map(m => MODULES.find(mod => mod.id === m.id)).filter(Boolean);
          const completedCount = pathModules.filter(m => isCompleted(m.id)).length;
          const progressPct = pathModules.length > 0 ? Math.round((completedCount / pathModules.length) * 100) : 0;

          return (
            <Card key={path.id} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-bold text-gray-100">{path.title}</h2>
                    <Badge variant="outline">{path.level}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 max-w-2xl">{path.description}</p>
                </div>

                <div className="flex items-center space-x-3 bg-gray-950 border border-gray-800 p-3 rounded-xl shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Path Progress</span>
                    <span className="text-sm font-extrabold text-blue-400 font-mono">{progressPct}%</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-blue-900 border-t-blue-500 flex items-center justify-center font-bold text-xs text-blue-300">
                    {completedCount}/{pathModules.length}
                  </div>
                </div>
              </div>

              {/* Modules List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pathModules.map((mod, idx) => {
                  const done = isCompleted(mod.id);
                  return (
                    <Link
                      key={mod.id}
                      to={`/module/${mod.id}`}
                      className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 group ${
                        done
                          ? "bg-emerald-950/20 border-emerald-800/60 hover:bg-emerald-950/40"
                          : "bg-gray-950/60 border-gray-800/80 hover:bg-gray-800/60"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-500">Step {idx + 1}</span>
                          {done && <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Done</span>}
                        </div>
                        <h4 className="text-xs font-bold text-gray-200 group-hover:text-blue-300 truncate">
                          {mod.title}
                        </h4>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-400 shrink-0 self-center" />
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
