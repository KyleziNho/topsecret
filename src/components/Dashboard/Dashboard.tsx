import { motion } from 'framer-motion';
import { DealCard } from './DealCard';
import { Plus, TrendingUp, DollarSign, FileText, Clock } from 'lucide-react';

const mockDeals = [
  {
    name: 'Project Thunder',
    company: 'TechCorp Industries',
    type: 'LBO' as const,
    value: '$450M',
    status: 'active' as const,
    date: '2024-03-15',
    irr: '25%'
  },
  {
    name: 'Project Lightning',
    company: 'Global Retail Co.',
    type: 'M&A' as const,
    value: '$280M',
    status: 'pending' as const,
    date: '2024-02-28',
    irr: '22%'
  },
  {
    name: 'Project Storm',
    company: 'Healthcare Plus',
    type: 'Growth' as const,
    value: '$175M',
    status: 'active' as const,
    date: '2024-03-01',
    irr: '18%'
  },
  {
    name: 'Project Phoenix',
    company: 'Manufacturing Ltd.',
    type: 'Restructuring' as const,
    value: '$320M',
    status: 'closed' as const,
    date: '2024-01-20',
    irr: '30%'
  },
];

const stats = [
  { label: 'Active Deals', value: '12', icon: TrendingUp, change: '+2' },
  { label: 'Total Portfolio', value: '$2.4B', icon: DollarSign, change: '+15%' },
  { label: 'Models Created', value: '48', icon: FileText, change: '+8' },
  { label: 'Avg. IRR', value: '24.5%', icon: Clock, change: '+2.1%' },
];

interface DashboardProps {
  onNewDeal: () => void;
}

export function Dashboard({ onNewDeal }: DashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Deal Pipeline</h1>
          <p className="text-gray-400 mt-1">Track and manage your active transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewDeal}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          New Deal
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-navy-900 rounded-xl p-6 border border-navy-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-emerald-400">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-100">{stat.value}</h3>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Recent Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockDeals.map((deal, index) => (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <DealCard {...deal} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}