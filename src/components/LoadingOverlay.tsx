import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-950/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-dark-950/90 rounded-xl p-6 flex items-center gap-3"
      >
        <Loader2 className="w-5 h-5 text-[#00FF9C] animate-spin" />
        <span className="text-sm">Loading store data...</span>
      </motion.div>
    </motion.div>
  );
};