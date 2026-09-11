import React from 'react';
import { BookOpen, HelpCircle, CheckCircle, Lightbulb } from 'lucide-react';

export function ExplanationPanel({ activeState }) {
  const { title, explanation, rule, why, learningObjectives } = activeState || {};

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 dark:bg-gray-900/80 dark:border-gray-800 light:bg-white light:border-gray-200">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 pb-2 border-b border-gray-800 light:border-gray-200">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <span>Step Explanation & Analysis</span>
      </div>

      {/* Title / Current Action */}
      <div>
        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          Current Action
        </h4>
        <div className="text-base font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
          {title || explanation || 'Ready to start simulation.'}
        </div>
      </div>

      {/* Applied Algorithm Rule */}
      {rule && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Algorithm Rule Applied:</span>
          </div>
          <p className="font-mono text-gray-200 dark:text-gray-200 light:text-gray-800">
            {rule}
          </p>
        </div>
      )}

      {/* Educational "Why?" Context */}
      {why && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why does this happen?</span>
          </h4>
          <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed bg-gray-950/40 p-3 rounded-lg border border-gray-800">
            {why}
          </p>
        </div>
      )}

      {/* Learning Objectives */}
      {learningObjectives && learningObjectives.length > 0 && (
        <div className="pt-2 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Objectives Addressed:</h4>
          <ul className="space-y-1 text-xs text-gray-400">
            {learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
