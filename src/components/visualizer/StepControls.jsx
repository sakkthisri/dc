import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Gauge
} from 'lucide-react';

export function StepControls({ 
  currentStep, 
  totalSteps, 
  isPlaying, 
  speed, 
  onNext, 
  onPrev, 
  onTogglePlay, 
  onReset, 
  onGoToStep, 
  onSpeedChange 
}) {
  const isAtStart = currentStep === 0;
  const isAtEnd = totalSteps > 0 && currentStep >= totalSteps - 1;

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-3 sm:p-4 backdrop-blur-md dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 dark:bg-gray-800 dark:text-gray-300 light:bg-gray-100 light:text-gray-700 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrev}
            disabled={isAtStart}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 light:bg-gray-100 light:text-gray-700 transition-colors cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
            title={isPlaying ? "Pause Simulation" : "Start Simulation"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span className="text-xs">{isAtEnd ? "Replay" : "Play"}</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={isAtEnd}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 light:bg-gray-100 light:text-gray-700 transition-colors cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full sm:w-auto max-w-md space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 font-mono">
            <span>Step {totalSteps > 0 ? currentStep + 1 : 0} of {totalSteps}</span>
            <span className="font-semibold text-blue-400">
              {Math.round(((currentStep + 1) / Math.max(totalSteps, 1)) * 100)}% Complete
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(totalSteps - 1, 0)}
            value={currentStep}
            onChange={(e) => onGoToStep && onGoToStep(parseInt(e.target.value))}
            className="w-full accent-blue-500 bg-gray-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-1 bg-gray-800/80 p-1 rounded-lg dark:bg-gray-800 light:bg-gray-100">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange && onSpeedChange(s)}
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
