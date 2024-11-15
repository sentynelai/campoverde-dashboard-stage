import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { dummyAudienceData } from '../lib/dummyData';

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin
};

export const AudienceKPIs: React.FC = () => {
  const { selectedStore } = useStoreSelection();

  const { totalAudience, totalTarget, platforms } = useMemo(() => {
    const platformData = Object.entries(dummyAudienceData).map(([key, data]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: data.current,
      target: data.target,
      color: data.color,
      icon: platformIcons[key as keyof typeof platformIcons]
    }));

    return {
      platforms: platformData,
      totalAudience: platformData.reduce((acc, p) => acc + p.value, 0),
      totalTarget: platformData.reduce((acc, p) => acc + p.target, 0)
    };
  }, []);

  if (!selectedStore) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`audience-kpis-${selectedStore.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed right-4 top-24 w-[calc(100%-2rem)] md:w-96 bg-dark-950/90 backdrop-blur-lg rounded-xl border border-dark-800/50 p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-dark-950/90 py-2">
          <Users className="w-5 h-5 text-[#00FF9C]" />
          <h2 className="text-lg font-semibold">Audience KPIs</h2>
        </div>

        <div className="space-y-4">
          {platforms.map((platform, index) => {
            const progress = (platform.value / platform.target) * 100;
            const isOnTarget = progress >= 85;
            
            return (
              <motion.div
                key={platform.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                    <span className="text-dark-200">{platform.name}</span>
                  </div>
                  <span className={`${isOnTarget ? 'text-[#00FF9C]' : 'text-orange-400'} font-medium`}>
                    {(platform.value / 1000).toFixed(1)}K
                  </span>
                </div>
                
                <div className="relative h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute h-full rounded-full"
                    style={{
                      backgroundColor: platform.color,
                      boxShadow: `0 0 10px ${platform.color}40`
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">
                    Progress: <span style={{ color: platform.color }}>
                      {progress.toFixed(1)}%
                    </span>
                  </span>
                  <span className="text-dark-400">
                    Target: {(platform.target / 1000).toFixed(1)}K
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-dark-800/50 sticky bottom-0 bg-dark-950/90 py-2 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Total Audience</span>
              <span className="text-[#00FF9C] font-medium">
                {(totalAudience / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Total Target</span>
              <span className="text-dark-200 font-medium">
                {(totalTarget / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};