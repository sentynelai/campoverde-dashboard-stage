import React from 'react';
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react';
import { STORE_DATA } from '../data/stores';

const stats = [
  {
    label: 'Total Sales',
    value: `$${(STORE_DATA.reduce((acc, store) => acc + store.sales, 0) / 1000000).toFixed(1)}M`,
    change: '+12%',
    icon: DollarSign,
  },
  {
    label: 'Customers',
    value: (STORE_DATA.reduce((acc, store) => acc + store.customers, 0)).toLocaleString(),
    change: '+8%',
    icon: Users,
  },
  {
    label: 'Digital Audience',
    value: (STORE_DATA.reduce((acc, store) => acc + store.digitalAudience, 0)).toLocaleString(),
    change: '+15%',
    icon: TrendingUp,
  },
];

export const Sidebar = () => {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4 space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-dark-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-lg font-medium mt-1">{stat.value}</p>
              </div>
              <div className="bg-dark-700/50 p-2 rounded-lg">
                <stat.icon className="w-5 h-5 text-accent-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
              <span className="text-dark-400 text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="font-medium mb-4">Store Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">West Region</span>
              <span className="text-sm">32%</span>
            </div>
            <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent-400 rounded-full" style={{ width: '32%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">East Region</span>
              <span className="text-sm">28%</span>
            </div>
            <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent-400/70 rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">Central Region</span>
              <span className="text-sm">40%</span>
            </div>
            <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent-400/40 rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};