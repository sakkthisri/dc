import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  COMPLETED_MODULES: 'dc_completed_modules',
  BOOKMARKS: 'dc_bookmarks',
  NOTES: 'dc_module_notes',
  QUIZ_SCORES: 'dc_quiz_scores',
  RECENT_MODULES: 'dc_recent_modules'
};

export function useUserProgress() {
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [quizScores, setQuizScores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [recentModules, setRecentModules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_MODULES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(completedModules)); } catch {}
  }, [completedModules]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks)); } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes)); } catch {}
  }, [notes]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(quizScores)); } catch {}
  }, [quizScores]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.RECENT_MODULES, JSON.stringify(recentModules)); } catch {}
  }, [recentModules]);

  // Methods
  const toggleCompleted = useCallback((moduleId) => {
    setCompletedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  }, []);

  const toggleBookmark = useCallback((moduleId) => {
    setBookmarks(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  }, []);

  const saveNote = useCallback((moduleId, noteText) => {
    setNotes(prev => ({
      ...prev,
      [moduleId]: noteText
    }));
  }, []);

  const deleteNote = useCallback((moduleId) => {
    setNotes(prev => {
      const copy = { ...prev };
      delete copy[moduleId];
      return copy;
    });
  }, []);

  const getNotes = useCallback((moduleId) => {
    return notes[moduleId] || '';
  }, [notes]);

  const saveQuizScore = useCallback((moduleId, score, total) => {
    setQuizScores(prev => {
      const existing = prev[moduleId] || { attempts: 0, bestScore: 0, total: total };
      return {
        ...prev,
        [moduleId]: {
          attempts: existing.attempts + 1,
          bestScore: Math.max(existing.bestScore, score),
          lastScore: score,
          total
        }
      };
    });
  }, []);

  const recordVisit = useCallback((moduleId) => {
    setRecentModules(prev => {
      const filtered = prev.filter(id => id !== moduleId);
      return [moduleId, ...filtered].slice(0, 10); // Keep last 10
    });
  }, []);

  const isCompleted = useCallback((id) => completedModules.includes(id), [completedModules]);
  const isBookmarked = useCallback((id) => bookmarks.includes(id), [bookmarks]);

  return {
    completedModules,
    bookmarks,
    notes,
    quizScores,
    recentModules,
    toggleCompleted,
    toggleBookmark,
    saveNote,
    saveNotes: saveNote, // Alias for API consistency
    getNotes,
    getNote: getNotes,   // Alias for API consistency
    deleteNote,
    saveQuizScore,
    recordVisit,
    isCompleted,
    isBookmarked
  };
}

export default useUserProgress;
