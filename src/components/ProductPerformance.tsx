import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { useProductKPIs } from '../hooks/useProductKPIs';

// Dummy data for when API data is not available
const dummyProducts = [
  { id: '1', description: 'CV ACAI ENERGIZE PWR', SALES_52W: 2687687, SALES_52W_PY: 3142264, SALES_MIX: 0.85 },
  { id: '2', description: 'CV FIT & WELLNESS', SALES_52W: 2458583, SALES_52W_PY: 2947759, SALES_MIX: 0.78 },
  { id: '3', description: 'CV ENERGY BOOST', SALES_52W: 1667353, SALES_52W_PY: 2248490, SALES_MIX: 0.92 },
  { id: '4', description: 'CV PASSION BLISS', SALES_52W: 1619596, SALES_52W_PY: 1982840, SALES_MIX: 0.67 },
  { id: '5', description: 'CV CHIA SUPREMACY', SALES_52W: 1415081, SALES_52W_PY: 1598339, SALES_MIX: 0.88 }
];

export const ProductPerformance: React.FC = () => {
  const { selectedStore } = useStoreSelection();
  const { products, isLoading } = useProductKPIs();

  // Use dummy data if no real data is available
  //const dummyProducts = products.length > 0 ? products : dummyProducts;

  if (!selectedStore) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`product-performance-${selectedStore.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed md:left-72 left-4 top-[280px] md:top-24 w-[calc(100%-2rem)] md:w-96 bg-dark-950/90 backdrop-blur-lg rounded-xl border border-dark-800/50 p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-dark-950/90 py-2">
          <DollarSign className="w-5 h-5 text-[#00FF9C]" />
          <h2 className="text-lg font-semibold">Store Products</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="h-4 bg-dark-800 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-dark-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dummyProducts.map((product, index) => {
              const progress = (product.SALES_MIX || 0) * 100;
              const isOnTarget = progress >= 85;
              
              return (
                <motion.div
                  key={`${product.id}-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-dark-200 flex-1 mr-2">{product.description}</span>
                    <span className={`${isOnTarget ? 'text-[#00FF9C]' : 'text-orange-400'} font-medium`}>
                      ${((product.SALES_52W || 0) / 1000000).toFixed(2)}M
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
                      Target: ${((product.SALES_52W_PY || 0) / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {dummyProducts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-dark-800/50 sticky bottom-0 bg-dark-950/90 py-2 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Total Revenue</span>
                <span className="text-[#00FF9C] font-medium">
                  ${(dummyProducts.reduce((acc, p) => acc + (p.SALES_52W || 0), 0) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Target Revenue</span>
                <span className="text-dark-200 font-medium">
                  ${(dummyProducts.reduce((acc, p) => acc + (p.SALES_52W_PY || 0), 0) / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            {products.length === 0 && (
              <div className="flex items-start gap-2 text-xs text-orange-400 bg-orange-400/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  The fetching data process is currently in progress, so the information may be incorrect or incomplete
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};