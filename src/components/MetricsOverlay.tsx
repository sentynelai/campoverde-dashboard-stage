import React, { useState } from 'react';
import { StoreStats } from './StoreStats';
import { RegionStats } from './RegionStats';
import { PopulationStats } from './PopulationStats';
import { Accordion } from './Accordion';

interface MetricsOverlayProps {
  position: 'left' | 'right';
}

export const MetricsOverlay: React.FC<MetricsOverlayProps> = ({ position }) => {
  const [openSection, setOpenSection] = useState<string>(position === 'left' ? 'stores' : 'regions');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto px-4">
      {position === 'left' ? (
        <Accordion
          title="Store Statistics"
          isOpen={openSection === 'stores'}
          onToggle={() => toggleSection('stores')}
        >
          <StoreStats />
        </Accordion>
      ) : (
        <>
          <Accordion
            title="Regional Overview"
            isOpen={openSection === 'regions'}
            onToggle={() => toggleSection('regions')}
          >
            <RegionStats />
          </Accordion>
          <div className="mt-4">
            <Accordion
              title="Digital Audience"
              isOpen={openSection === 'population'}
              onToggle={() => toggleSection('population')}
            >
              <PopulationStats />
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
};