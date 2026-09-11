import React from 'react';
import { Terminal } from 'lucide-react';

export function CodePanel({ codeLines = [], activeLine = null }) {
  if (!codeLines || codeLines.length === 0) return null;

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 font-mono text-xs overflow-hidden dark:bg-gray-950 dark:border-gray-800 light:bg-slate-900 light:border-slate-800 light:text-slate-100 shadow-lg">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-800 text-gray-400">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Algorithm Pseudocode</span>
        </div>
        <span className="text-[10px] text-gray-500">Conceptual Spec</span>
      </div>

      <div className="space-y-1 overflow-x-auto">
        {codeLines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-blue-600/30 text-blue-300 font-bold border-l-2 border-blue-400 pl-3'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-[10px] text-gray-600 select-none w-5 text-right">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
