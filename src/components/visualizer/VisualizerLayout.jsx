import React, { useState } from 'react';
import { 
  BookOpen, 
  Activity, 
  CheckCircle, 
  Bookmark,
  HelpCircle,
  FileText,
  X,
  Save,
  Check
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Breadcrumb } from '../ui/Breadcrumb';
import { CATEGORIES } from '../../data/categories';
import { UNITS } from '../../data/units';
import { getVisualizerComponent } from '../../visualizers/registry';
import { useUserProgress } from '../../hooks/useUserProgress';
import { QUIZZES } from '../../data/quizzes';
import { QuizEngine } from '../quiz/QuizEngine';
import { PredictMode } from './PredictMode';
import { TheoryPanel } from '../theory/TheoryPanel';

export function VisualizerLayout({ module }) {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showPredictBanner, setShowPredictBanner] = useState(false);

  const {
    isCompleted,
    toggleCompleted,
    isBookmarked,
    toggleBookmark,
    getNotes,
    saveNotes,
    saveQuizScore
  } = useUserProgress();

  const category = CATEGORIES.find(c => c.id === module.category);
  const unit = UNITS.find(u => u.id === module.unit);

  const VisualizerComp = getVisualizerComponent(module.id);

  const bookmarked = isBookmarked(module.id);
  const completed = isCompleted(module.id);
  const quizData = QUIZZES[module.id];
  const [noteText, setNoteText] = useState(getNotes(module.id) || '');
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNotes = () => {
    saveNotes(module.id, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const priorityLabel = {
    high: '🔴 HIGH PRIORITY',
    medium: '🟠 MEDIUM PRIORITY',
    low: '🟢 LOW PRIORITY'
  }[module.examPriority || 'medium'];

  const breadcrumbItems = [
    { label: `Unit ${unit?.unitNumber}`, to: `/unit/${unit?.unitNumber}` },
    { label: category?.title || 'Category', to: `/category/${category?.id}` },
    { label: module.title }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gray-900/90 border-b border-gray-800 px-4 sm:px-6 py-4 dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
                {module.title}
              </h1>
              {/* PROMINENT EXAM PRIORITY BADGE */}
              <Badge variant={module.examPriority || 'medium'} size="sm">
                {priorityLabel}
              </Badge>
              {VisualizerComp ? (
                <Badge variant="available" size="sm">
                  Interactive Visualizer
                </Badge>
              ) : (
                <Badge variant="info" size="sm">
                  Theory Topic
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1 max-w-3xl">
              {module.description}
            </p>
          </div>

          {/* User Progress Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => toggleCompleted(module.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                completed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
              }`}
              title="Mark module complete"
            >
              <CheckCircle className={`w-4 h-4 ${completed ? 'text-emerald-400 fill-emerald-500/20' : ''}`} />
              <span>{completed ? 'Completed' : 'Mark Done'}</span>
            </button>

            <button
              onClick={() => toggleBookmark(module.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                bookmarked
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
              }`}
              title="Bookmark module"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            {quizData && (
              <button
                onClick={() => setShowQuizModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Quiz</span>
              </button>
            )}

            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showNotesDrawer
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </button>

            {VisualizerComp && (
              <button
                onClick={() => setShowPredictBanner(!showPredictBanner)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  showPredictBanner
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-gray-800/80 text-gray-400 border-gray-700 hover:text-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{showPredictBanner ? 'Predict Mode ON' : 'Predict Mode'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Predict Mode Banner (if toggled) */}
      {showPredictBanner && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
          <PredictMode
            nextStepState={{
              title: `${module.title} - Next Algorithmic Phase`,
              explanation: `Verify network conditions, consensus quorum, or message delivery state before stepping into execution.`
            }}
            onConfirmAdvance={() => {}}
          />
        </div>
      )}

      {/* Notes Drawer */}
      {showNotesDrawer && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
          <div className="p-4 bg-gray-900 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>My Personal Notes for {module.title}</span>
              </div>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="text-gray-400 hover:text-gray-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              key={module.id}
              defaultValue={getNotes(module.id)}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your study notes, key formulas, or insights here..."
              rows={3}
              className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {noteSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal Overlay */}
      {showQuizModal && quizData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <QuizEngine
              quizData={quizData}
              onSaveScore={(score, total) => saveQuizScore(module.id, score, total)}
              onClose={() => setShowQuizModal(false)}
            />
          </div>
        </div>
      )}

      {/* Interactive Visualizer Canvas (when available) */}
      {VisualizerComp && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
          {React.createElement(VisualizerComp)}
        </div>
      )}

      {/* Comprehensive Theory Panel (Always Visible for Every Module) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-200 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Syllabus Reference Theory & Exam Preparation</span>
        </div>
        <TheoryPanel module={module} />
      </div>
    </div>
  );
}

export default VisualizerLayout;
