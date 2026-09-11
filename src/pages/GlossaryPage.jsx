import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GLOSSARY_TERMS } from '../data/glossary';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BookOpen, ExternalLink } from 'lucide-react';

export function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-gray-900 to-teal-950/80 border border-emerald-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/50 border border-emerald-700/50 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Distributed Computing Dictionary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Subject Terminology Glossary
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Search core distributed systems definitions and immediately navigate to their interactive visualizer modules.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search glossary terms (e.g. CAP, Quorum, RPC)..."
        />
      </div>

      {/* Term Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(t => (
          <Card key={t.id} className="p-5 flex flex-col justify-between space-y-3 hover:border-emerald-700/50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-100">{t.term}</h3>
                <Badge variant="outline">{t.category}</Badge>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{t.definition}</p>
            </div>

            {t.relatedModuleId && (
              <div className="pt-3 border-t border-gray-800 flex justify-end">
                <Link
                  to={`/module/${t.relatedModuleId}`}
                  className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold hover:text-emerald-300"
                >
                  <span>Explore Interactive Visualizer</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </Card>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
            No matching glossary terms found for "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
}
