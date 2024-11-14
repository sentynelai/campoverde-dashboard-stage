import React from 'react';
import { USAMap } from './USAMap';
import { DashboardOverlay } from './DashboardOverlay';

export const Dashboard: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-950">
      <div className="absolute inset-0 z-0">
        <USAMap />
      </div>
      <div className="relative z-10">
        <DashboardOverlay />
      </div>
    </div>
  );
};