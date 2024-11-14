import React from 'react';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useStoreData } from '../hooks/useStoreData';

export const HeaderMetrics: React.FC = () => {
  const { stores, isLoading } = useStoreData();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 md:gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 w-48 bg-dark-800/50 rounded-lg" />
        ))}
      </div>
    );
  }

  const totalSales = stores.reduce((acc, store) => acc + store.sales, 0);
  const totalCustomers = stores.reduce((acc, store) => acc + store.customers, 0);
  const avgTrend = stores.reduce((acc, store) => acc + store.trend, 0) / stores.length;
  const totalSocialReach = stores.reduce((acc, store) => 
    acc + Object.values(store.socialMedia).reduce((sum, val) => sum + val, 0), 0
  );

  const metrics = [
    {
      label: 'Total Sales',
      value: `$${(totalSales / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      gauge: 85,
      trend: '+12.5%'
    },
    {
      label: 'Customers',
      value: `${(totalCustomers / 1000).toFixed(1)}K`,
      icon: Users,
      gauge: 78,
      trend: '+8.3%'
    },
    {
      label: 'Growth',
      value: `${avgTrend.toFixed(1)}%`,
      icon: TrendingUp,
      gauge: avgTrend,
      trend: `${avgTrend >= 0 ? '+' : ''}${avgTrend.toFixed(1)}%`
    },
    {
      label: 'Social Reach',
      value: `${(totalSocialReach / 1000000).toFixed(1)}M`,
      icon: Activity,
      gauge: 92,
      trend: '+15.7%'
    }
  ];

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-3 min-w-[200px]">
          <div className="relative h-16 w-16 flex-shrink-0">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-dark-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-[#00FF9C]"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - metric.gauge / 100)}`}
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <metric.icon className="w-4 h-4 text-[#00FF9C]" />
              <span className="text-xs font-medium mt-1">{metric.gauge}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-dark-400">{metric.label}</p>
            <p className="text-lg font-semibold">{metric.value}</p>
            <p className="text-xs text-[#00FF9C]">{metric.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
};