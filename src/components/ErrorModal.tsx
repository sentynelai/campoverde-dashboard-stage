import React from 'react';
import { XCircle, X, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreData } from '../hooks/useStoreData';
import { useProductKPIs } from '../hooks/useProductKPIs';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, error }) => {
  const { stores } = useStoreData();
  const { products } = useProductKPIs();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-dark-950 rounded-lg shadow-xl z-50 border border-dark-800"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h2 className="text-lg font-semibold">Data Fetch Error</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-dark-200">{error}</p>
                </div>

                <div className="bg-dark-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-dark-200">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Current Data Status:</span>
                  </div>
                  
                  <div className="space-y-2 pl-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-400">Total Locations:</span>
                      <span className="font-medium">{stores.length.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-400">Products Tracked:</span>
                      <span className="font-medium">{products.length.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-dark-500 mt-2">
                      {stores.length === 0 && products.length === 0 ? (
                        <span className="text-orange-400">No data available. Using fallback data.</span>
                      ) : (
                        <span>Using {stores.length > 0 && products.length > 0 ? 'cached' : 'fallback'} data</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};