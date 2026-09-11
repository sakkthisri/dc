import React from 'react';

export function Legend({ items = [] }) {
  const defaultItems = [
    { label: 'Active Process', color: 'bg-blue-500 border-blue-400' },
    { label: 'Coordinator / Leader', color: 'bg-amber-400 border-amber-300' },
    { label: 'Critical Section', color: 'bg-emerald-500 border-emerald-400' },
    { label: 'Requesting Lock', color: 'bg-purple-500 border-purple-400' },
    { label: 'Crashed Node', color: 'bg-rose-500 border-rose-400' }
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 text-[11px] text-gray-400">
      <span className="font-semibold text-gray-300 uppercase tracking-wider text-[10px]">Legend:</span>
      {list.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full border ${item.color}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
