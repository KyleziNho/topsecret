import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Calculator, 
  MessageSquare, 
  Settings,
  Plus,
  TrendingUp,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Deals', href: '/deals' },
  { icon: Calculator, label: 'Models', href: '/models' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/chat' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-64 bg-navy-900 border-r border-navy-800"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-100">DealFlow Pro</h1>
              <p className="text-xs text-gray-400">M&A Modeling Suite</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            New Deal
          </motion.button>
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.label);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors",
                  isActive
                    ? "bg-navy-800 text-gray-100"
                    : "text-gray-400 hover:text-gray-100 hover:bg-navy-800/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-100">Acme Capital</p>
              <p className="text-xs text-gray-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}