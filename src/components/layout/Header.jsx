import React from 'react';
import { Menu, Search, Sun, Moon, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header({ onOpenMobileNav, onOpenSearch, theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-gray-950/80 border-b border-gray-800/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800/80 light:bg-white/90 light:border-gray-200 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Mobile Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Network className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-100 dark:text-gray-100 light:text-gray-900 tracking-tight">
              DC Visualizer
            </span>
          </Link>

          {/* Desktop Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200 dark:bg-gray-900 dark:border-gray-800 light:bg-gray-100 light:border-gray-200 light:text-gray-600 transition-all text-xs w-64 md:w-80 cursor-pointer"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span className="flex-1 text-left">Search visualizers, topics...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 border border-gray-700 rounded text-gray-400 dark:bg-gray-800 light:bg-white light:border-gray-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Side: Mobile Search Trigger & Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
