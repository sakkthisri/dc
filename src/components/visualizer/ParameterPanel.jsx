import React from 'react';
import { Sliders, Plus, Send, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export function ParameterPanel({ 
  nodeCount = 3, 
  onNodeCountChange, 
  onTriggerLocalEvent, 
  onTriggerSendMsg, 
  onTriggerFailNode
}) {
  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 space-y-4 dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 pb-2 border-b border-gray-800 light:border-gray-200">
        <Sliders className="w-4 h-4 text-blue-400" />
        <span>Algorithm Controls & Actions</span>
      </div>

      {/* Node Count Slider */}
      {onNodeCountChange && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-300 font-medium">
            <span>Processors / Nodes:</span>
            <span className="font-bold text-blue-400">{nodeCount}</span>
          </div>
          <input
            type="range"
            min="3"
            max="6"
            value={nodeCount}
            onChange={(e) => onNodeCountChange(parseInt(e.target.value))}
            className="w-full accent-blue-500 bg-gray-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Action triggers */}
      <div className="space-y-2 pt-2 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Trigger Process Events
        </div>

        {onTriggerLocalEvent && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full justify-start text-xs" 
            icon={Plus}
            onClick={onTriggerLocalEvent}
          >
            Add Local Compute Event
          </Button>
        )}

        {onTriggerSendMsg && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs" 
            icon={Send}
            onClick={onTriggerSendMsg}
          >
            Send Message Between Processes
          </Button>
        )}

        {onTriggerFailNode && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" 
            icon={AlertTriangle}
            onClick={onTriggerFailNode}
          >
            Simulate Coordinator/Node Failure
          </Button>
        )}
      </div>
    </div>
  );
}
