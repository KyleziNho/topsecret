import { motion } from 'framer-motion';
import { Building2, TrendingUp, Calendar, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DealCardProps {
  name: string;
  company: string;
  type: 'LBO' | 'M&A' | 'Growth' | 'Restructuring';
  value: string;
  status: 'active' | 'closed' | 'pending';
  date: string;
  irr?: string;
}

const typeColors = {
  LBO: 'from-blue-500 to-indigo-600',
  'M&A': 'from-purple-500 to-pink-600',
  Growth: 'from-emerald-500 to-teal-600',
  Restructuring: 'from-orange-500 to-red-600',
};

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export function DealCard({ name, company, type, value, status, date, irr }: DealCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-navy-900 rounded-xl p-6 border border-navy-800 hover:border-navy-700 transition-all cursor-pointer shadow-lg hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
            typeColors[type]
          )}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{name}</h3>
            <p className="text-sm text-gray-400">{company}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Deal Value</span>
          <span className="font-semibold text-gray-100">{value}</span>
        </div>
        
        {irr && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Target IRR</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">{irr}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-navy-800">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            {date}
          </div>
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium border",
            statusColors[status]
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}