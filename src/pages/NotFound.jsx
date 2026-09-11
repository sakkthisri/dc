import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Network, Home, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound({ 
  title = "404 — Node Disconnected", 
  description = "The requested route or syllabus resource could not be located in the distributed network." 
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      
      {/* Visual graphic */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-2xl">
          <Network className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-500 text-white shadow-lg">
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>

      <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
        HTTP 404 STATUS
      </span>

      <h1 className="text-2xl sm:text-4xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 mb-2">
        {title}
      </h1>

      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button 
          variant="secondary" 
          size="md" 
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>

        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Return Home
          </Button>
        </Link>
      </div>

    </div>
  );
}
