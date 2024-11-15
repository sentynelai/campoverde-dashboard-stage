import React from 'react';
import { Logo } from './Logo';
import { HeaderGauges } from './HeaderGauges';
import { Users, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudienceMap } from './AudienceMap';
import { useStoreData } from '../hooks/useStoreData';
import { LoadingTooltip } from './LoadingTooltip';
import { ErrorModal } from './ErrorModal';

export const Header: React.FC = () => {
  const [showAudienceMap, setShowAudienceMap] = React.useState(false);
  const { 
    refreshData, 
    lastUpdate, 
    isLoading, 
    isRefreshing,
    errorMessage,
    showErrorModal,
    setShowErrorModal
  } = useStoreData();

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="h-20 px-4 md:px-6 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-dark-400">
              <div className="group flex items-center gap-2">
                <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
                {(isLoading || isRefreshing) && <LoadingTooltip />}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-colors disabled:opacity-50"
                disabled={isRefreshing || isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh DS</span>
              </motion.button>
            </div>
            <HeaderGauges />
            <button
              onClick={() => setShowAudienceMap(!showAudienceMap)}
              className="p-2 rounded-lg hover:bg-dark-800/50 transition-colors"
              title="Audience Mapping"
            >
              <Users className="w-5 h-5 text-[#00FF9C]" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showAudienceMap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40"
              onClick={() => setShowAudienceMap(false)}
            />
            <AudienceMap onClose={() => setShowAudienceMap(false)} />
          </>
        )}
      </AnimatePresence>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={errorMessage || 'An unknown error occurred'}
      />
    </>
  );
};