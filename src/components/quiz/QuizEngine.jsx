import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function QuizEngine({ quizData, onSaveScore, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        No quiz available for this module.
      </div>
    );
  }

  const currentQ = quizData.questions[currentIndex];
  const isLastQuestion = currentIndex === quizData.questions.length - 1;

  const handleSelect = (optionIdx) => {
    if (isSubmitted) return;

    if (currentQ.type === 'multi') {
      const currentSelection = selectedAnswers[currentQ.id] || [];
      const updated = currentSelection.includes(optionIdx)
        ? currentSelection.filter(idx => idx !== optionIdx)
        : [...currentSelection, optionIdx];
      setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: updated });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: optionIdx });
    }
  };

  const handleCheckAnswer = () => {
    setIsSubmitted(true);
    let currentTotalScore = score;

    const userAns = selectedAnswers[currentQ.id];
    let isCorrect = false;

    if (currentQ.type === 'multi') {
      const sortedUser = (userAns || []).sort().join(',');
      const sortedCorrect = (currentQ.correctAnswer || []).sort().join(',');
      isCorrect = sortedUser === sortedCorrect;
    } else {
      isCorrect = userAns === currentQ.correctAnswer;
    }

    if (isCorrect) {
      currentTotalScore += 1;
      setScore(currentTotalScore);
    }

    if (isLastQuestion && onSaveScore) {
      onSaveScore(currentTotalScore, quizData.questions.length);
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const userAns = selectedAnswers[currentQ.id];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-2xl space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{quizData.title}</h3>
          <p className="text-xs text-gray-400">
            Question {currentIndex + 1} of {quizData.questions.length}
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-950/50 border border-emerald-800/80 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Score: {score}/{quizData.questions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-100">{currentQ.question}</p>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentQ.type === 'multi'
              ? (userAns || []).includes(idx)
              : userAns === idx;

            let optStyle = "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60";
            if (isSubmitted) {
              const isCorrectOpt = currentQ.type === 'multi'
                ? currentQ.correctAnswer.includes(idx)
                : currentQ.correctAnswer === idx;

              if (isCorrectOpt) {
                optStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold";
              } else if (isSelected && !isCorrectOpt) {
                optStyle = "bg-red-950/60 border-red-500 text-red-300";
              }
            } else if (isSelected) {
              optStyle = "bg-blue-900/40 border-blue-500 text-blue-200 font-bold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optStyle}`}
              >
                <span>{opt}</span>
                {isSubmitted && (
                  <span>
                    {(currentQ.type === 'multi' ? currentQ.correctAnswer.includes(idx) : currentQ.correctAnswer === idx) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box */}
      {isSubmitted && (
        <div className="p-3 bg-blue-950/30 border border-blue-800/60 rounded-lg text-xs space-y-1">
          <span className="font-bold text-blue-300">Explanation:</span>
          <p className="text-gray-300 leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <button
          onClick={handleRestart}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Quiz</span>
        </button>

        {!isSubmitted ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={userAns === undefined || (Array.isArray(userAns) && userAns.length === 0)}
            size="sm"
          >
            Check Answer
          </Button>
        ) : !isLastQuestion ? (
          <Button onClick={handleNext} size="sm">
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        ) : (
          <Button onClick={onClose} variant="secondary" size="sm">
            Close Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
