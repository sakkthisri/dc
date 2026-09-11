import React from 'react';
import { Send } from 'lucide-react';

export function MessagePacket({ message }) {
  const { fromPos, toPos, progress = 0.5, label, timestamp, status, type } = message;

  if (!fromPos || !toPos) return null;

  // Calculate current animated coordinates along vector
  const currentX = fromPos.x + (toPos.x - fromPos.x) * Math.min(Math.max(progress, 0), 1);
  const currentY = fromPos.y + (toPos.y - fromPos.y) * Math.min(Math.max(progress, 0), 1);

  const isDropped = status === 'DROPPED';

  // Color schemes based on message type
  let color = 'bg-cyan-500 text-cyan-950 border-cyan-300';
  let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40';

  if (type === 'ELECTION') {
    color = 'bg-amber-500 text-amber-950 border-amber-300';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-400/40';
  } else if (type === 'MARKER') {
    color = 'bg-purple-500 text-purple-950 border-purple-300';
    badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-400/40';
  } else if (type === 'COORDINATOR' || type === 'TOKEN') {
    color = 'bg-emerald-500 text-emerald-950 border-emerald-300';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
  } else if (isDropped) {
    color = 'bg-rose-500 text-white border-rose-400';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-400/40';
  }

  return (
    <div
      style={{ left: `${currentX}px`, top: `${currentY}px`, transform: 'translate(-50%, -50%)' }}
      className="absolute z-30 pointer-events-none transition-all duration-150 flex flex-col items-center"
    >
      {/* Payload label badge */}
      <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-lg backdrop-blur-md flex items-center gap-1 ${badgeColor}`}>
        <Send className="w-2.5 h-2.5" />
        <span>{label || 'MSG'}</span>
        {timestamp !== undefined && (
          <span className="font-extrabold text-white bg-black/40 px-1 rounded">
            T:{timestamp}
          </span>
        )}
      </div>

      {/* Packet dot graphic */}
      <div className={`w-3.5 h-3.5 rounded-full border-2 ${color} shadow-md animate-ping-slow mt-1 flex items-center justify-center`}>
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>
    </div>
  );
}
