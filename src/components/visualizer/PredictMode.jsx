import React, { useState } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

export function PredictMode({ nextStepState, onConfirmAdvance }) {
  const [prediction, setPrediction] = useState(null);
  const [revealed, setRevealed] = useState(false);

  if (!nextStepState) return null;

  const predictedOptions = [
    { id: 'ACCEPT', label: 'Message deliver / consensus quorum achieved' },
    { id: 'REJECT', label: 'Message reject / timeout / crash failure' },
    { id: 'ELECTION', label: 'Leader election triggered / vote granted' }
  ];

  const handlePredict = (optId) => {
    if (revealed) return;
    setPrediction(optId);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleContinue = () => {
    setPrediction(null);
    setRevealed(false);
    onConfirmAdvance();
  };

  return (
    <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-800/60 rounded-xl p-4 space-y-3 my-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-purple-300 font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>Predict-Before-Run Mode</span>
        </div>
        <span className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded text-[10px] font-mono">
          Step Challenge
        </span>
      </div>

      <p className="text-gray-300">
        Based on the current topology state, what will happen in the next simulation step?
      </p>

      <div className="space-y-1.5">
        {predictedOptions.map(opt => {
          const isSelected = prediction === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handlePredict(opt.id)}
              className={`w-full text-left p-2 rounded border transition-all ${
                isSelected
                  ? "bg-purple-900/60 border-purple-400 text-purple-200 font-bold"
                  : "bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-800/60"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          onClick={handleReveal}
          disabled={!prediction}
          className="w-full py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold rounded transition-colors"
        >
          Check Prediction
        </button>
      ) : (
        <div className="space-y-2 pt-2 border-t border-purple-800/40">
          <div className="p-2 bg-purple-900/40 rounded border border-purple-700/50 space-y-1">
            <span className="font-bold text-purple-200">Next Step Outcome:</span>
            <p className="text-gray-300 font-mono text-[11px]">{nextStepState.title}</p>
            <p className="text-gray-400 text-[11px] mt-1">{nextStepState.why || nextStepState.explanation}</p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded transition-colors flex items-center justify-center space-x-1"
          >
            <span>Execute Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
