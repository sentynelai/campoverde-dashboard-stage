import React from 'react';
import { Brain } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-950">
      <div className="relative mb-8">
        <Brain className="w-16 h-16 text-[#00FF9C]" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#00FF9C] rounded-full animate-ping" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Sentynel Analytics</h1>
      <p className="text-dark-400">Loading your dashboard...</p>
    </div>
  );
}