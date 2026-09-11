import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { UnitPage } from './pages/UnitPage';
import { CategoryPage } from './pages/CategoryPage';
import { ModulePage } from './pages/ModulePage';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

import { LearningPathsPage } from './pages/LearningPathsPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { AuditPage } from './pages/AuditPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

import { ExamRevisionPage } from './pages/ExamRevisionPage';

export function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="unit/:unitId" element={<UnitPage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="module/:moduleId" element={<ModulePage />} />
            <Route path="revision" element={<ExamRevisionPage />} />
            <Route path="learning-paths" element={<LearningPathsPage />} />
            <Route path="comparisons" element={<ComparisonPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="my-learning" element={<MyLearningPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
