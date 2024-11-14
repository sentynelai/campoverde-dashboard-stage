import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Map } from './components/Map';
import { AudienceMetrics } from './components/AudienceMetrics';
import { SocialFooter } from './components/SocialFooter';
import { LoadingScreen } from './components/LoadingScreen';
import { ChatAssistant } from './components/ChatAssistant';
import { ProductPerformance } from './components/ProductPerformance';
import { AnimatePresence } from 'framer-motion';
import { useStoreSelection } from './hooks/useStoreSelection';
import { useStoreData } from './hooks/useStoreData';

function App() {
  const { isLoading, isError } = useStoreData();
  const { selectedStore } = useStoreSelection();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Data</h1>
          <p className="text-dark-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-dark-950 relative overflow-hidden">
        {/* Fixed Header */}
        <Header />
        
        {/* Background Map */}
        <div className="fixed inset-0 z-0">
          <Map />
        </div>

        {/* Audience Metrics - Only show when store is selected */}
        <AnimatePresence>
          {selectedStore && (
            <AudienceMetrics key={`metrics-${selectedStore.id}`} />
          )}
        </AnimatePresence>

        {/* Product Performance */}
        <AnimatePresence>
          {selectedStore && (
            <ProductPerformance key={`products-${selectedStore.id}`} />
          )}
        </AnimatePresence>

        {/* Social Footer */}
        <SocialFooter />

        {/* Chat Assistant */}
        <ChatAssistant />
      </div>
    </ErrorBoundary>
  );
}

export default App;