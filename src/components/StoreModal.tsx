import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, DollarSign, Users, TrendingUp, Phone } from 'lucide-react';
import type { StoreData } from '../types';

interface StoreModalProps {
  store: StoreData;
  onClose: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({ store, onClose }) => {
  const satisfactionRate = (store.positive / store.reviews) * 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed right-4 top-24 w-[calc(100%-2rem)] md:w-96 bg-dark-950/90 rounded-xl border border-dark-800/50 p-6 z-[60]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00FF9C]/20">
              <MapPin className="w-5 h-5 text-[#00FF9C]" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Location #1{store.index}</p>
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <p className="text-xs text-dark-400">{store.city}, {store.state}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              label: 'Sales',
              value: `$${(store.total_sales / 1000000).toFixed(1)}M`,
              icon: DollarSign,
              color: '[#00FF9C]'
            },
            {
              label: 'Population',
              value: `${(store.poblacion_10km / 1000).toFixed(1)}K`,
              icon: Users,
              color: 'blue-400'
            },
            {
              label: 'Satisfaction',
              value: `${satisfactionRate.toFixed(1)}%`,
              icon: TrendingUp,
              color: satisfactionRate >= 0 ? '[#00FF9C]' : 'red-400'
            },
            {
              label: 'Digital',
              value: `${(store.digital_audience / 1000).toFixed(1)}K`,
              icon: Users,
              color: 'orange-400'
            }
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between bg-dark-800/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${item.color}/20`}>
                  <item.icon className={`w-5 h-5 text-${item.color}`} />
                </div>
                <span className="text-dark-400">{item.label}</span>
              </div>
              <span className={`font-medium text-${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-dark-800/50 space-y-3">
          <div className="text-sm text-dark-400 mb-2">Customer Reviews</div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00FF9C] rounded-full transition-all duration-500"
              style={{ width: `${(store.positive / store.reviews) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#00FF9C]">{store.positive} positive</span>
            <span className="text-red-400">{store.negative} negative</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dark-800/50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Address</span>
            <span className="font-medium text-right">{store.street_address}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Phone</span>
            <a 
              href={`tel:${store.phone_number_1}`}
              className="font-medium flex items-center gap-2 hover:text-[#00FF9C] transition-colors"
            >
              <Phone className="w-4 h-4" />
              {store.phone_number_1}
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};