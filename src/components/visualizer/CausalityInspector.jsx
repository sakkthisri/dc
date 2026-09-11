import React, { useState } from 'react';
import { GitCommit, ArrowRight } from 'lucide-react';
import { compareVectorClocks } from '../../utils/simulationUtils';

export function CausalityInspector({ events = [] }) {
  const [eventAIdx, setEventAIdx] = useState(0);
  const [eventBIdx, setEventBIdx] = useState(events.length > 1 ? 1 : 0);

  if (events.length === 0) return null;

  const eventA = events[eventAIdx] || events[0];
  const eventB = events[eventBIdx] || events[0];

  const relation = compareVectorClocks(eventA?.vectorClock, eventB?.vectorClock);

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 space-y-4 dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 pb-2 border-b border-gray-800 light:border-gray-200">
        <GitCommit className="w-4 h-4 text-cyan-400" />
        <span>Vector Causality Inspector</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Select Event A */}
        <div>
          <label className="block text-gray-400 mb-1 font-medium">Select Event A:</label>
          <select
            value={eventAIdx}
            onChange={(e) => setEventAIdx(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-2 font-mono text-xs"
          >
            {events.map((evt, idx) => (
              <option key={idx} value={idx}>
                #{idx + 1}: {evt.action || evt.title} [{evt.vectorClock ? evt.vectorClock.join(',') : ''}]
              </option>
            ))}
          </select>
        </div>

        {/* Select Event B */}
        <div>
          <label className="block text-gray-400 mb-1 font-medium">Select Event B:</label>
          <select
            value={eventBIdx}
            onChange={(e) => setEventBIdx(parseInt(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-2 font-mono text-xs"
          >
            {events.map((evt, idx) => (
              <option key={idx} value={idx}>
                #{idx + 1}: {evt.action || evt.title} [{evt.vectorClock ? evt.vectorClock.join(',') : ''}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Result Box */}
      <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 flex flex-col items-center justify-center text-center space-y-2">
        <div className="flex items-center gap-3 font-mono text-sm font-bold text-gray-200">
          <span>Event A [{eventA?.vectorClock ? eventA.vectorClock.join(', ') : '?'}]</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Event B [{eventB?.vectorClock ? eventB.vectorClock.join(', ') : '?'}]</span>
        </div>

        <div>
          {relation === 'BEFORE' && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
              Event A Causal Precedes Event B (A → B)
            </span>
          )}
          {relation === 'AFTER' && (
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold text-xs">
              Event B Causal Precedes Event A (B → A)
            </span>
          )}
          {relation === 'CONCURRENT' && (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs">
              Events are CONCURRENT (A || B) — No Causal Dependency
            </span>
          )}
          {relation === 'EQUAL' && (
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold text-xs">
              Same Event Timestamps (Identical State)
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 max-w-md pt-1 leading-relaxed">
          {relation === 'BEFORE' && "All vector components of A are ≤ B and at least one component is strictly < B."}
          {relation === 'AFTER' && "All vector components of B are ≤ A and at least one component is strictly < A."}
          {relation === 'CONCURRENT' && "Neither A ≤ B nor B ≤ A holds. These two events occurred independently without causal information flow between them!"}
        </p>
      </div>
    </div>
  );
}
