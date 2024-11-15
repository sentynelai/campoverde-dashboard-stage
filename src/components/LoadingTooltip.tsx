import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LoadingTooltipProps {
  className?: string;
}

export const LoadingTooltip: React.FC<LoadingTooltipProps> = ({ className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <AlertCircle className="w-4 h-4 text-orange-400 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-dark-900 text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap border border-dark-800 z-50">
        The fetching process is currently running, so some information may be incorrect or incomplete
      </div>
    </div>
  );
};