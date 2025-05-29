import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calculator, Calendar } from 'lucide-react';

interface ModelInputsProps {
  inputs: any;
  onChange: (inputs: any) => void;
  dealType: string;
}

export function ModelInputs({ inputs, onChange, dealType }: ModelInputsProps) {
  const updateInput = (category: string, field: string, value: any) => {
    onChange({
      ...inputs,
      [category]: {
        ...inputs[category],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-navy-900 rounded-xl p-6 border border-navy-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-100">Revenue Assumptions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Base Year Revenue ($M)
            </label>
            <input
              type="number"
              value={inputs.revenue.baseRevenue}
              onChange={(e) => updateInput('revenue', 'baseRevenue', parseFloat(e.target.value))}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Annual Growth Rate
            </label>
            <input
              type="number"
              value={(inputs.revenue.growthRate * 100).toFixed(1)}
              onChange={(e) => updateInput('revenue', 'growthRate', parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              step="0.1"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-navy-900 rounded-xl p-6 border border-navy-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-100">Operating Assumptions</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              COGS (% of Revenue)
            </label>
            <input
              type="number"
              value={(inputs.costs.cogs * 100).toFixed(1)}
              onChange={(e) => updateInput('costs', 'cogs', parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpEx (% of Revenue)
            </label>
            <input
              type="number"
              value={(inputs.costs.opex * 100).toFixed(1)}
              onChange={(e) => updateInput('costs', 'opex', parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CapEx (% of Revenue)
            </label>
            <input
              type="number"
              value={(inputs.costs.capex * 100).toFixed(1)}
              onChange={(e) => updateInput('costs', 'capex', parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              step="0.1"
            />
          </div>
        </div>
      </motion.div>

      {dealType === 'lbo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900 rounded-xl p-6 border border-navy-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-100">Financing Structure</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Debt Amount ($M)
              </label>
              <input
                type="number"
                value={inputs.financing.debtAmount}
                onChange={(e) => updateInput('financing', 'debtAmount', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interest Rate
              </label>
              <input
                type="number"
                value={(inputs.financing.interestRate * 100).toFixed(1)}
                onChange={(e) => updateInput('financing', 'interestRate', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-navy-900 rounded-xl p-6 border border-navy-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-100">Exit Assumptions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exit Multiple (x EBITDA)
            </label>
            <input
              type="number"
              value={inputs.exit.exitMultiple}
              onChange={(e) => updateInput('exit', 'exitMultiple', parseFloat(e.target.value))}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exit Year
            </label>
            <input
              type="number"
              value={inputs.exit.exitYear}
              onChange={(e) => updateInput('exit', 'exitYear', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
              min="1"
              max="10"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}