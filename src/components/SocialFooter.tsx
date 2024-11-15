import React from 'react';
import { Building2, Package, Share2 } from 'lucide-react';
import { useStoreData } from '../hooks/useStoreData';
import { useProductKPIs } from '../hooks/useProductKPIs';
import { motion, AnimatePresence } from 'framer-motion';

export const SocialFooter: React.FC = () => {
  const { stores } = useStoreData();
  const { products } = useProductKPIs();
  
  const totalLocations = stores.length;
  const totalProducts = products.length;

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
      value: '92.5%',
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
      </div>
    </div>
  );
};