import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, DollarSign, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface NewDealModalProps {
  onClose: () => void;
  onSubmit: (dealData: any) => void;
}

const dealTypes = [
  { value: 'lbo', label: 'Leveraged Buyout', description: 'Traditional PE buyout with leverage' },
  { value: 'ma', label: 'Merger & Acquisition', description: 'Strategic or financial acquisition' },
  { value: 'growth', label: 'Growth Equity', description: 'Minority investment for expansion' },
  { value: 'restructuring', label: 'Restructuring', description: 'Distressed or turnaround situation' },
];

export function NewDealModal({ onClose, onSubmit }: NewDealModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    dealType: 'lbo',
    dealSize: '',
    targetIRR: '',
    closingDate: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-navy-900 rounded-2xl p-8 max-w-2xl w-full border border-navy-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Create New Deal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., Project Thunder"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., TechCorp Industries"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {dealTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, dealType: type.value })}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      formData.dealType === type.value
                        ? "bg-blue-500/20 border-blue-500 text-gray-100"
                        : "bg-navy-800 border-navy-700 text-gray-400 hover:border-navy-600"
                    )}
                  >
                    <div className="font-medium mb-1">{type.label}</div>
                    <div className="text-xs opacity-70">{type.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deal Size
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.dealSize}
                    onChange={(e) => setFormData({ ...formData, dealSize: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., 450M"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target IRR
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetIRR}
                  onChange={(e) => setFormData({ ...formData, targetIRR: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., 25%"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Closing
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    required
                    value={formData.closingDate}
                    onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Brief description (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-navy-800 text-gray-300 rounded-lg font-medium hover:bg-navy-700 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Create Deal & Build Model
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}