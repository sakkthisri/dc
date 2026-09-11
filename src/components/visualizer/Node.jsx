import React from 'react';
import { Crown, AlertTriangle, Lock, Radio, Clock } from 'lucide-react';

export function Node({ 
  node, 
  onClick, 
  isSelected = false, 
  showClock = true,
  showVector = false
}) {
  const { id, label, x, y, status, clock, vectorClock, customLabel, isLeader } = node;

  const isCrashed = status === 'CRASHED' || status === 'FAILED';
  const isElection = status === 'ELECTION';
  const isInCS = status === 'IN_CRITICAL_SECTION' || status === 'IN_CS';
  const isRequesting = status === 'REQUESTING' || status === 'WAITING';

  // Status colors & styles
  let borderColor = 'border-blue-500/50';
  let bgColor = 'bg-gray-900';
  let shadowColor = 'shadow-blue-500/10';

  if (isCrashed) {
    borderColor = 'border-rose-500/80';
    bgColor = 'bg-rose-950/40';
    shadowColor = 'shadow-rose-500/20';
  } else if (isLeader) {
    borderColor = 'border-amber-400';
    bgColor = 'bg-amber-950/40';
    shadowColor = 'shadow-amber-500/30';
  } else if (isInCS) {
    borderColor = 'border-emerald-400';
    bgColor = 'bg-emerald-950/50';
    shadowColor = 'shadow-emerald-500/30';
  } else if (isElection) {
    borderColor = 'border-cyan-400';
    bgColor = 'bg-cyan-950/40';
    shadowColor = 'shadow-cyan-500/20';
  } else if (isRequesting) {
    borderColor = 'border-purple-400';
    bgColor = 'bg-purple-950/40';
  }

  return (
    <div
      onClick={() => onClick && onClick(node)}
      style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
      className={`
        absolute flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${borderColor} ${bgColor} ${shadowColor}
        shadow-xl backdrop-blur-md transition-all duration-300 cursor-pointer select-none
        ${isSelected ? 'ring-4 ring-blue-400 scale-110 z-20' : 'hover:scale-105 z-10'}
        ${isCrashed ? 'opacity-60' : ''}
      `}
    >
      {/* Crown indicator for leader */}
      {isLeader && !isCrashed && (
        <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-amber-400 text-gray-950 text-[10px] font-black flex items-center gap-1 shadow-md animate-bounce">
          <Crown className="w-3 h-3 fill-current" />
          <span>LEADER</span>
        </div>
      )}

      {/* Process ID & Title */}
      <div className="flex items-center gap-1.5 font-bold text-sm text-gray-100 dark:text-gray-100 light:text-gray-900">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span>{label || id}</span>
      </div>

      {customLabel && (
        <span className="text-[10px] text-gray-400 font-medium">{customLabel}</span>
      )}

      {/* Scalar Clock indicator */}
      {showClock && clock !== undefined && (
        <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold">
          <Clock className="w-3 h-3" />
          <span>C = {clock}</span>
        </div>
      )}

      {/* Vector Clock indicator */}
      {showVector && vectorClock && (
        <div className="mt-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold tracking-wider">
          V = [{vectorClock.join(', ')}]
        </div>
      )}

      {/* Status badge */}
      <div className="mt-1.5">
        {isCrashed ? (
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            CRASHED
          </span>
        ) : isInCS ? (
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
            <Lock className="w-2.5 h-2.5" />
            CRITICAL SECTION
          </span>
        ) : isElection ? (
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1 animate-pulse">
            <Radio className="w-2.5 h-2.5" />
            ELECTING
          </span>
        ) : isRequesting ? (
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
            REQUESTING
          </span>
        ) : (
          <span className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            ACTIVE
          </span>
        )}
      </div>
    </div>
  );
}
