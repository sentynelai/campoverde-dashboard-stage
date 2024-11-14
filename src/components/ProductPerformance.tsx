import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { useStoreSelection } from '../hooks/useStoreSelection';

const products = [
  { name: 'CV ACAI ENERGIZE PWR', current: 2687687, target: 3142264 },
  { name: 'CV FIT & WELLNESS', current: 2458583, target: 2947759 },
  { name: 'CV ENERGY BOOST', current: 1667353, target: 2248490 },
  { name: 'CV PASSION BLISS', current: 1619596, target: 1982840 },
  { name: 'CV CHIA SUPREMACY', current: 1415081, target: 1598339 },
  { name: 'CV EXOTIC INDULGENCE', current: 203795, target: 337743 }
];

export const ProductPerformance: React.FC = () => {
  const { selectedStore } = useStoreSelection();

  return (
    <AnimatePresence>
      {selectedStore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed md:left-72 left-4 top-[280px] md:top-24 w-[calc(100%-2rem)] md:w-96 bg-dark-950/90 backdrop-blur-lg rounded-xl border border-dark-800/50 p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-[#00FF9C]" />
            <h2 className="text-lg font-semibold">Store Products</h2>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => {
              const progress = (product.current / product.target) * 100;
              const isOnTarget = progress >= 85;
              
              return (
                <motion.div
                  key={product.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-200 flex-1 mr-2">{product.name}</span>
                    <span className={`${isOnTarget ? 'text-[#00FF9C]' : 'text-orange-400'} font-medium`}>
                      ${(product.current / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  
                  <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
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
                      Target: ${(product.target / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-dark-800/50">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Total Revenue</span>
              <span className="text-[#00FF9C] font-medium">
                ${(products.reduce((acc, p) => acc + p.current, 0) / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-dark-400">Target Revenue</span>
              <span className="text-dark-200 font-medium">
                ${(products.reduce((acc, p) => acc + p.target, 0) / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};