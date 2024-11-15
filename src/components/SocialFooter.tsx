import React, { useMemo } from 'react';
import { Building2, Package, Share2 } from 'lucide-react';
import { useStoreData } from '../hooks/useStoreData';
import { useProductKPIs } from '../hooks/useProductKPIs';
import { motion, AnimatePresence } from 'framer-motion';

const TrendChart: React.FC<{ data: { reach: number; goal: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => Math.max(d.reach, d.goal)));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.reach / maxValue) * 100,
    goalY: 100 - (d.goal / maxValue) * 100
  }));

  const reachLine = points.map(p => `${p.x},${p.y}`).join(' ');
  const goalLine = points.map(p => `${p.x},${p.goalY}`).join(' ');

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={goalLine}
        fill="none"
        stroke="#666"
        strokeWidth="1"
        strokeDasharray="2,2"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={reachLine}
        fill="none"
        stroke="#00FF9C"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const SocialFooter: React.FC = () => {
  const { stores } = useStoreData();
  const { products } = useProductKPIs();
  
  const totalLocations = stores.length;
  const totalProducts = products.length;
  
  const audienceData = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      reach: Math.floor(Math.random() * 50000 + 150000),
      goal: 200000
    }))
  , []);

  const metrics = [
    { 
      icon: Building2,
      label: 'Total Locations',
      value: totalLocations.toLocaleString(),
      color: '#00FF9C'
    },
    { 
      icon: Package,
      label: 'Products Tracked',
      value: totalProducts.toLocaleString(),
      color: '#00FF9C'
    },
    {
      icon: Share2,
      label: 'Audience Reach',
      value: `${((audienceData[audienceData.length - 1]?.reach || 0) / (audienceData[audienceData.length - 1]?.goal || 1) * 100).toFixed(1)}%`,
      color: '#00FF9C'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-950/60 backdrop-blur-md py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className="relative group"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2">
                <metric.icon 
                  className="w-5 h-5" 
                  style={{ color: metric.color }} 
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${metric.label}-${metric.value}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm text-dark-400">{metric.label}</p>
                    <p className="text-sm font-medium">{metric.value}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-96 h-12">
          <TrendChart data={audienceData} />
        </div>
      </div>
    </div>
  );
};