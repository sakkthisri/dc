import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Cpu,
  ArrowRight
} from 'lucide-react';
import { getModuleTheory } from '../../data/moduleTheory';

export function TheoryPanel({ module }) {
  const [activeTab, setActiveTab] = useState('overview');
  const theory = getModuleTheory(module);

  if (!theory) return null;

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200">
      {/* Header Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-950/80 border-b border-gray-800 dark:bg-gray-950/80 light:bg-gray-100 light:border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 dark:text-gray-400 light:text-gray-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Overview & Concept</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 dark:text-gray-400 light:text-gray-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture & Steps</span>
        </button>

        <button
          onClick={() => setActiveTab('tradeoffs')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'tradeoffs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 dark:text-gray-400 light:text-gray-600'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Trade-offs & Example</span>
        </button>

        <button
          onClick={() => setActiveTab('examFocus')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'examFocus'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-400 hover:bg-rose-950/30'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>Exam Focus (★)</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-cyan-400 hover:bg-cyan-950/30'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Common Questions</span>
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="p-5 space-y-5 text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed">
        {/* OVERVIEW & CONCEPT TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-blue-400 dark:text-blue-400 light:text-blue-600 mb-1">
                Overview
              </h4>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">{theory.overview}</p>
            </div>

            <div className="p-4 bg-gray-950/60 border border-gray-800 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Academic Definition
              </span>
              <p className="text-gray-200 font-medium leading-normal">{theory.definition}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 mb-2">
                Core Principles & Foundations
              </h4>
              <div className="p-4 bg-gray-950/40 border border-gray-800 rounded-xl whitespace-pre-wrap font-mono text-[11px] text-gray-300 leading-relaxed">
                {theory.coreConcept}
              </div>
            </div>
          </div>
        )}

        {/* ARCHITECTURE & STEPS TAB */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-blue-400 mb-2">
                Architecture, Components & Protocol Steps
              </h4>
              <div className="p-4 bg-gray-950/60 border border-gray-800 rounded-xl font-mono text-[11px] text-gray-200 whitespace-pre-wrap leading-relaxed">
                {theory.architectureOrSteps}
              </div>
            </div>

            {theory.example && (
              <div className="p-4 bg-indigo-950/30 border border-indigo-800/50 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  Concrete Example
                </span>
                <p className="text-gray-200 text-xs leading-relaxed">{theory.example}</p>
              </div>
            )}
          </div>
        )}

        {/* TRADE-OFFS & ADVANTAGES TAB */}
        {activeTab === 'tradeoffs' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advantages */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Advantages</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {theory.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase">
                  <AlertCircle className="w-4 h-4" />
                  <span>Limitations & Trade-offs</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {theory.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">&bull;</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* EXAM FOCUS TAB */}
        {activeTab === 'examFocus' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-800/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-black text-sm uppercase tracking-wider">
                <Star className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>EXAM FOCUS POINTS (High Yield Revision)</span>
              </div>
              <ul className="space-y-2">
                {theory.examFocus.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-100 font-medium">
                    <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 bg-gray-950/60 border border-gray-800 rounded-xl space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                Concise Key Takeaways
              </span>
              <ul className="space-y-1 text-xs text-gray-300">
                {theory.keyTakeaways.map((kt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400">&bull;</span>
                    <span>{kt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* COMMON QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/50 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>COMMON UNIVERSITY EXAM QUESTIONS</span>
              </div>
              <div className="space-y-2">
                {theory.commonQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-200 font-medium">
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TheoryPanel;
