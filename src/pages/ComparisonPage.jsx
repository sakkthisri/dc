import React, { useState } from 'react';
import { COMPARISONS } from '../data/comparisons';
import { Card } from '../components/ui/Card';
import { GitCompare, CheckCircle2, AlertCircle } from 'lucide-react';

export function ComparisonPage() {
  const [selectedId, setSelectedId] = useState(COMPARISONS[0].id);
  const activeComp = COMPARISONS.find(c => c.id === selectedId) || COMPARISONS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-gray-900 to-indigo-950/80 border border-purple-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-purple-900/50 border border-purple-700/50 px-3 py-1 rounded-full text-purple-300 text-xs font-semibold">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Algorithm & Architecture Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Distributed Systems Comparative Analysis
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Compare core distributed algorithms and architectural trade-offs side-by-side. Understand message complexity, failure handling, latency, and ideal production use cases.
          </p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {COMPARISONS.map(comp => (
          <button
            key={comp.id}
            onClick={() => setSelectedId(comp.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedId === comp.id
                ? "bg-purple-900/60 border-purple-500 text-purple-200 shadow-lg"
                : "bg-gray-900/80 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            {comp.title}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item A */}
        <Card className="p-6 space-y-5 border-emerald-900/40 bg-gray-900/90">
          <div className="pb-3 border-b border-gray-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Option A</span>
            <h2 className="text-lg font-bold text-gray-100 mt-0.5">{activeComp.itemA.name}</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Purpose</span>
              <p className="text-gray-400 mt-1 leading-relaxed">{activeComp.itemA.purpose}</p>
            </div>
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Architecture</span>
              <p className="text-gray-400 mt-1 leading-relaxed">{activeComp.itemA.architecture}</p>
            </div>
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Execution Flow</span>
              <p className="text-gray-400 mt-1 leading-relaxed font-mono">{activeComp.itemA.executionFlow}</p>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg space-y-1">
              <span className="font-bold text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                Key Advantages
              </span>
              <p className="text-gray-300">{activeComp.itemA.advantages}</p>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg space-y-1">
              <span className="font-bold text-red-300 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 inline mr-1" />
                Limitations & Overhead
              </span>
              <p className="text-gray-300">{activeComp.itemA.limitations}</p>
            </div>

            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Target Use Cases</span>
              <p className="text-blue-300 font-semibold mt-1">{activeComp.itemA.useCases}</p>
            </div>
          </div>
        </Card>

        {/* Item B */}
        <Card className="p-6 space-y-5 border-blue-900/40 bg-gray-900/90">
          <div className="pb-3 border-b border-gray-800">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Option B</span>
            <h2 className="text-lg font-bold text-gray-100 mt-0.5">{activeComp.itemB.name}</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Purpose</span>
              <p className="text-gray-400 mt-1 leading-relaxed">{activeComp.itemB.purpose}</p>
            </div>
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Architecture</span>
              <p className="text-gray-400 mt-1 leading-relaxed">{activeComp.itemB.architecture}</p>
            </div>
            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Execution Flow</span>
              <p className="text-gray-400 mt-1 leading-relaxed font-mono">{activeComp.itemB.executionFlow}</p>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg space-y-1">
              <span className="font-bold text-blue-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 inline mr-1" />
                Key Advantages
              </span>
              <p className="text-gray-300">{activeComp.itemB.advantages}</p>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg space-y-1">
              <span className="font-bold text-red-300 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 inline mr-1" />
                Limitations & Overhead
              </span>
              <p className="text-gray-300">{activeComp.itemB.limitations}</p>
            </div>

            <div>
              <span className="font-bold text-gray-300 uppercase tracking-wide text-[10px]">Target Use Cases</span>
              <p className="text-blue-300 font-semibold mt-1">{activeComp.itemB.useCases}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
