import React from 'react';
import { Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function EventLog({ events = [], currentStep = 0 }) {
  const visibleEvents = events.slice(0, currentStep + 1);

  const getEventBadge = (type) => {
    switch (type) {
      case 'LOCAL_EVENT':
        return <Badge variant="info" size="xs">Local Event</Badge>;
      case 'SEND_MESSAGE':
      case 'SEND':
        return <Badge variant="primary" size="xs">Send MSG</Badge>;
      case 'RECEIVE_MESSAGE':
      case 'RECEIVE':
        return <Badge variant="success" size="xs">Receive MSG</Badge>;
      case 'ELECTION':
        return <Badge variant="warning" size="xs">Election</Badge>;
      case 'COORDINATOR':
      case 'LEADER':
        return <Badge variant="purple" size="xs">Coordinator</Badge>;
      case 'NODE_FAILURE':
      case 'CRASH':
        return <Badge variant="high" size="xs">Node Crash</Badge>;
      case 'SNAPSHOT_MARKER':
        return <Badge variant="purple" size="xs">Marker</Badge>;
      default:
        return <Badge variant="default" size="xs">{type || 'Event'}</Badge>;
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col h-full dark:bg-gray-900/80 dark:border-gray-800 light:bg-white light:border-gray-200">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 dark:border-gray-800 light:border-gray-200 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>System Event History ({visibleEvents.length})</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          Step {currentStep + 1}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-56 space-y-2 pr-1">
        {visibleEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No events logged yet. Press Next Step or Play to begin.
          </div>
        ) : (
          visibleEvents.map((evt, idx) => {
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs transition-all duration-150 ${
                  isCurrent
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-sm shadow-blue-500/10 font-medium text-gray-100'
                    : 'bg-gray-950/40 border-gray-800/80 text-gray-400 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gray-500">#{idx + 1}</span>
                    {getEventBadge(evt.type)}
                  </div>
                  {evt.clock !== undefined && (
                    <span className="text-[10px] font-mono text-blue-400 font-bold">
                      T: {evt.clock}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-200 dark:text-gray-200 light:text-gray-800 leading-snug">
                  {evt.description || evt.action}
                </div>

                {(evt.from || evt.to) && (
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-mono">
                    {evt.from && <span>Src: <strong className="text-gray-300">{evt.from}</strong></span>}
                    {evt.to && <span>Dest: <strong className="text-gray-300">{evt.to}</strong></span>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
