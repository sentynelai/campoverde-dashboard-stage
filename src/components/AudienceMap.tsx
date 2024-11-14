import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Dumbbell, Coffee, Leaf, Sun, X } from 'lucide-react';
import { useStoreSelection } from '../hooks/useStoreSelection';

const audiences = [
  { 
    name: 'Sport Enthusiasts', 
    icon: Dumbbell, 
    percentage: 35, 
    color: '#00FF9C',
    avgSales: 2450000,
    reachGoal: 500000,
    currentReach: 425000
  },
  { 
    name: 'Health Conscious', 
    icon: Heart, 
    percentage: 28, 
    color: '#FF6B6B',
    avgSales: 1850000,
    reachGoal: 400000,
    currentReach: 380000
  },
  { 
    name: 'Energy Seekers', 
    icon: Coffee, 
    percentage: 15, 
    color: '#4ECDC4',
    avgSales: 980000,
    reachGoal: 250000,
    currentReach: 200000
  },
  { 
    name: 'Wellness Warriors', 
    icon: Leaf, 
    percentage: 12, 
    color: '#45B7D1',
    avgSales: 750000,
    reachGoal: 200000,
    currentReach: 185000
  },
  { 
    name: 'Active Lifestyle', 
    icon: Sun, 
    percentage: 10, 
    color: '#96CEB4',
    avgSales: 620000,
    reachGoal: 150000,
    currentReach: 145000
  }
];

interface Props {
  onClose: () => void;
}

export const AudienceMap: React.FC<Props> = ({ onClose }) => {
  const { selectedStore } = useStoreSelection();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-dark-950/90 backdrop-blur-lg rounded-xl border border-dark-800/50 p-6 z-50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00FF9C]" />
            <h2 className="text-lg font-semibold">
              {selectedStore ? `Store #${selectedStore.id} ` : ''}
              Audience Demographics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-4 bg-dark-800/50 rounded-lg overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <audience.icon className="w-5 h-5" style={{ color: audience.color }} />
                  <span className="text-sm font-medium">{audience.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-dark-400">Avg. Sales</p>
                    <p className="text-lg font-bold" style={{ color: audience.color }}>
                      ${(audience.avgSales / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">Share</p>
                    <p className="text-lg font-bold" style={{ color: audience.color }}>
                      {audience.percentage}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-400">Reach Goal</span>
                    <span>{(audience.reachGoal / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(audience.currentReach / audience.reachGoal) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: audience.color }}
                    />
                  </div>
                  <div className="text-xs text-right" style={{ color: audience.color }}>
                    {((audience.currentReach / audience.reachGoal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.05, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="absolute -right-4 -bottom-4 w-24 h-24"
                style={{ color: audience.color }}
              >
                <audience.icon className="w-full h-full" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}