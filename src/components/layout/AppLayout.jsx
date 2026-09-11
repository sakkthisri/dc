import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchBar } from '../ui/SearchBar';
import { useTheme } from '../../hooks/useTheme';

export function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 dark:bg-gray-950 dark:text-gray-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-200">
      
      {/* Responsive Sidebar Navigation */}
      <Sidebar 
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Backdrop for mobile sidebar drawer */}
      {isMobileNavOpen && (
        <div 
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-gray-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area offset by Sidebar width on desktop (72 = 18rem = 288px) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        
        {/* Header Bar */}
        <Header 
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Dynamic Route Content Outlet */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-gray-800/80 bg-gray-950/40 py-8 px-6 text-center text-xs text-gray-500 dark:border-gray-800/80 light:border-gray-200 light:bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">
                DISTRIBUTED COMPUTING VISUALIZER
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-400 light:text-gray-600 mt-0.5">
                Interactive Learning Platform for Distributed Systems Syllabus (45 Periods, 3 Units, 26 Categories)
              </p>
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-400 light:text-gray-600">
              Phase 1 Foundation Architecture
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Modal */}
      <SearchBar 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

    </div>
  );
}
