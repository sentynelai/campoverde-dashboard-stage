import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { dummyKPIs } from '../lib/dummyData';

export const ProductPerformance: React.FC = () => {
  const { selectedStore } = useStoreSelection();

  const { totalRevenue, totalTarget } = useMemo(() => ({
    totalRevenue: dummyKPIs.reduce((acc, kpi) => acc + kpi.SALES_52W, 0),
    totalTarget: dummyKPIs.reduce((acc, kpi) => acc + kpi.SALES_52W_PY, 0)
  }), []);

  if (!selectedStore) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`product-performance-${selectedStore.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed md:left-[420px] left-4 top-24 w-[calc(100%-2rem)] md:w-96 bg-dark-950/90 backdrop-blur-lg rounded-xl border border-dark-800/50 p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-dark-950/90 py-2">
          <DollarSign className="w-5 h-5 text-[#00FF9C]" />
          <h2 className="text-lg font-semibold">Store Products</h2>
        </div>

        <div className="space-y-4">
          {dummyKPIs.map((kpi, index) => {
            const progress = (kpi.SALES_52W / kpi.SALES_52W_PY) * 100;
            const isOnTarget = progress >= 85;
            
            return (
              <motion.div
                key={kpi.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-dark-200 flex-1 mr-2">{kpi.description}</span>
                  <span className={`${isOnTarget ? 'text-[#00FF9C]' : 'text-orange-400'} font-medium`}>
                    ${(kpi.SALES_52W / 1000000).toFixed(2)}M
                  </span>
                </div>
                
                <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute h-full ${isOnTarget ? 'bg-[#00FF9C]' : 'bg-orange-400'} rounded-full`}
                    style={{
                      boxShadow: isOnTarget 
                        ? '0 0 10px rgba(0, 255, 156, 0.3)' 
                        : '0 0 10px rgba(251, 146, 60, 0.3)'
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">
                    Progress: <span className={isOnTarget ? 'text-[#00FF9C]' : 'text-orange-400'}>
                      {progress.toFixed(1)}%
                    </span>
                  </span>
                  <span className="text-dark-400">
                    Target: ${(kpi.SALES_52W_PY / 1000000).toFixed(2)}M
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-dark-800/50 sticky bottom-0 bg-dark-950/90 py-2 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Total Revenue</span>
              <span className="text-[#00FF9C] font-medium">
                ${(totalRevenue / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Target Revenue</span>
              <span className="text-dark-200 font-medium">
                ${(totalTarget / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};