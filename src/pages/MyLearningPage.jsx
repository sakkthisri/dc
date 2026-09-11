import React from 'react';
import { Link } from 'react-router-dom';
import { MODULES } from '../data/modules';
import { useUserProgress } from '../hooks/useUserProgress';
import { Bookmark, Award, BookOpen, ArrowRight, Trash2, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function MyLearningPage() {
  const { bookmarks, completedModules, notes, quizScores, toggleBookmark, deleteNote } = useUserProgress();

  const bookmarkedMods = MODULES.filter(m => bookmarks.includes(m.id));
  const noteEntries = Object.entries(notes).filter(([, text]) => text && text.trim().length > 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/80 via-gray-900 to-indigo-950/80 border border-blue-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-700/50 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Learning & Study Notes
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Manage your bookmarked modules, review quiz scores, read your personal study notes, and jump back into recently viewed visualizers.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Completed</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{completedModules.length} / {MODULES.length}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Bookmarks</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{bookmarks.length}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Quizzes Taken</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{Object.keys(quizScores).length}</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Personal Notes</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{noteEntries.length}</p>
        </Card>
      </div>

      {/* Bookmarks Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>Bookmarked Modules ({bookmarkedMods.length})</span>
        </h2>

        {bookmarkedMods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedMods.map(m => (
              <Card key={m.id} className="p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{m.category}</Badge>
                    <button onClick={() => toggleBookmark(m.id)} className="text-amber-400 hover:text-red-400">
                      <Bookmark className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-gray-100">{m.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{m.description}</p>
                </div>

                <Link
                  to={`/module/${m.id}`}
                  className="pt-2 border-t border-gray-800 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
                >
                  <span>Launch Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400 text-xs bg-gray-900/50 rounded-xl border border-gray-800">
            No bookmarked modules yet. Click the bookmark icon on any visualizer page to save it here.
          </div>
        )}
      </div>

      {/* Personal Notes Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Saved Study Notes ({noteEntries.length})</span>
        </h2>

        {noteEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noteEntries.map(([modId, text]) => {
              const mod = MODULES.find(m => m.id === modId);
              return (
                <Card key={modId} className="p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">{mod?.title || modId}</span>
                      <button
                        onClick={() => deleteNote(modId)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 bg-gray-950 p-3 rounded-lg border border-gray-800 font-mono whitespace-pre-wrap">
                      {text}
                    </p>
                  </div>

                  <Link
                    to={`/module/${modId}`}
                    className="pt-2 border-t border-gray-800 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-between"
                  >
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400 text-xs bg-gray-900/50 rounded-xl border border-gray-800">
            No study notes saved yet. Open any visualizer module and click 'Notes' to save notes.
          </div>
        )}
      </div>

      {/* Quiz Scores Section */}
      {Object.keys(quizScores).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-100 flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Quiz Achievements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(quizScores).map(([modId, scoreData]) => {
              const mod = MODULES.find(m => m.id === modId);
              return (
                <Card key={modId} className="p-4 space-y-2">
                  <span className="text-[10px] font-mono text-gray-400">{mod?.title || modId}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Best Score:</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {scoreData.bestScore} / {scoreData.total}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">Total Attempts: {scoreData.attempts}</span>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyLearningPage;
