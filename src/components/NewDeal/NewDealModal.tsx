import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, DollarSign, Calendar, FileText, ChevronRight, ChevronLeft, TrendingUp, Calculator, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface NewDealModalProps {
  onClose: () => void;
  onSubmit: (dealData: any) => void;
}

const dealTypes = [
  { value: 'acquisition', label: 'Business Acquisition' },
  { value: 'merger', label: 'Merger' },
  { value: 'growth', label: 'Growth Investment' },
  { value: 'restructuring', label: 'Restructuring' },
];

const sectors = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 
  'Retail', 'Energy', 'Real Estate', 'Consumer Goods', 'Other'
];

const businessModels = [
  'SaaS', 'Manufacturing', 'E-commerce', 'Services', 'Marketplace', 'Other'
];

const ownershipStructures = ['Private', 'Public', 'PE-backed', 'Family-owned'];

const currencies = ['$', '€', '£', '¥'];

export function NewDealModal({ onClose, onSubmit }: NewDealModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Step 1 - Deal Information
    name: '',
    dealType: 'acquisition',
    sector: 'Technology',
    geography: 'United States',
    businessModel: 'Manufacturing',
    ownershipStructure: 'Private',
    
    // Step 2 - Transaction Details
    acquisitionDate: new Date().toISOString().split('T')[0],
    holdingPeriodMonths: 24,
    currency: '$',
    purchasePrice: '',
    transactionFees: 0.015,
    acquisitionLTV: 0.8,
    reportingFrequency: 'monthly',
    
    // Step 3 - Financing
    debtIssuanceFees: 0.01,
    baseRate: 0.01,
    interestRateMargin: 0.02,
    
    // Step 4 - Operating Costs
    staffExpenses: 60000,
    salaryGrowth: 0.005,
    costItems: [
      { name: 'Rent & Utilities', amount: 200000 },
      { name: 'Marketing', amount: 100000 },
      { name: 'Insurance', amount: 20000 },
      { name: 'Professional Fees', amount: 50000 },
      { name: 'Other OpEx', amount: 30000 },
    ],
    revenueGrowth: 0.1,
    
    // Step 5 - Exit Assumptions
    disposalCosts: 0.005,
    terminalMultiple: 11.0,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCostItem = (index: number, field: 'name' | 'amount', value: any) => {
    const newCostItems = [...formData.costItems];
    newCostItems[index] = { ...newCostItems[index], [field]: value };
    setFormData(prev => ({ ...prev, costItems: newCostItems }));
  };

  const addCostItem = () => {
    setFormData(prev => ({
      ...prev,
      costItems: [...prev.costItems, { name: '', amount: 0 }]
    }));
  };

  const removeCostItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costItems: prev.costItems.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate derived values
    const purchasePrice = parseFloat(formData.purchasePrice) * 1000000;
    const debtAmount = purchasePrice * formData.acquisitionLTV;
    const equityAmount = purchasePrice * (1 - formData.acquisitionLTV) + (purchasePrice * formData.transactionFees);
    
    const dealData = {
      ...formData,
      dealSize: formData.purchasePrice,
      company: formData.name,
      targetIRR: '25%', // Default target
      financing: {
        debtAmount: debtAmount / 1000000,
        equityAmount: equityAmount / 1000000,
        interestRate: formData.baseRate + formData.interestRateMargin,
        term: 7,
      },
      revenue: {
        baseYear: new Date(formData.acquisitionDate).getFullYear(),
        baseRevenue: 100, // Will be input in model builder
        growthRate: formData.revenueGrowth,
        years: Math.ceil(formData.holdingPeriodMonths / 12),
      },
      costs: {
        cogs: 0.6, // Will be input in model builder
        opex: formData.costItems.reduce((sum, item) => sum + item.amount, 0) / 100000000, // As % of revenue
        capex: 0.05,
      },
      exit: {
        exitMultiple: formData.terminalMultiple,
        exitYear: Math.ceil(formData.holdingPeriodMonths / 12),
      },
    };
    
    onSubmit(dealData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Deal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deal Name / Target Company
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Sample Company Ltd."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deal Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {dealTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFormData('dealType', type.value)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      formData.dealType === type.value
                        ? "bg-blue-500/20 border-blue-500 text-gray-100"
                        : "bg-navy-800 border-navy-700 text-gray-400 hover:border-navy-600"
                    )}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sector/Industry
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => updateFormData('sector', e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Geography
                </label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={(e) => updateFormData('geography', e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Model
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => updateFormData('businessModel', e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  {businessModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ownership Structure
                </label>
                <select
                  value={formData.ownershipStructure}
                  onChange={(e) => updateFormData('ownershipStructure', e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  {ownershipStructures.map(structure => (
                    <option key={structure} value={structure}>{structure}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Transaction Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Acquisition Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => updateFormData('acquisitionDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Holding Period (Months)
                </label>
                <input
                  type="number"
                  value={formData.holdingPeriodMonths}
                  onChange={(e) => updateFormData('holdingPeriodMonths', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  min="12"
                  max="120"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateFormData('currency', e.target.value)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Purchase Price (millions)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    required
                    value={formData.purchasePrice}
                    onChange={(e) => updateFormData('purchasePrice', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 22"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction Fees %
                </label>
                <input
                  type="number"
                  value={(formData.transactionFees * 100).toFixed(2)}
                  onChange={(e) => updateFormData('transactionFees', parseFloat(e.target.value) / 100)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Acquisition LTV %
                </label>
                <input
                  type="number"
                  value={(formData.acquisitionLTV * 100).toFixed(1)}
                  onChange={(e) => updateFormData('acquisitionLTV', parseFloat(e.target.value) / 100)}
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  step="5"
                  min="0"
                  max="90"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reporting Frequency
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData('reportingFrequency', 'monthly')}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    formData.reportingFrequency === 'monthly'
                      ? "bg-blue-500/20 border-blue-500 text-gray-100"
                      : "bg-navy-800 border-navy-700 text-gray-400 hover:border-navy-600"
                  )}
                >
                  Monthly
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData('reportingFrequency', 'yearly')}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    formData.reportingFrequency === 'yearly'
                      ? "bg-blue-500/20 border-blue-500 text-gray-100"
                      : "bg-navy-800 border-navy-700 text-gray-400 hover:border-navy-600"
                  )}
                >
                  Yearly
                </motion.button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Financing Structure</h3>
            
            <div className="bg-navy-800/50 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Purchase Price:</span>
                  <span className="text-gray-100 font-medium">
                    {formData.currency}{parseFloat(formData.purchasePrice || '0').toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Debt ({(formData.acquisitionLTV * 100).toFixed(0)}%):</span>
                  <span className="text-gray-100 font-medium">
                    {formData.currency}{(parseFloat(formData.purchasePrice || '0') * formData.acquisitionLTV).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Equity:</span>
                  <span className="text-gray-100 font-medium">
                    {formData.currency}{(parseFloat(formData.purchasePrice || '0') * (1 - formData.acquisitionLTV)).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Debt Issuance Fees %
              </label>
              <input
                type="number"
                value={(formData.debtIssuanceFees * 100).toFixed(2)}
                onChange={(e) => updateFormData('debtIssuanceFees', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Base Interest Rate %
              </label>
              <input
                type="number"
                value={(formData.baseRate * 100).toFixed(2)}
                onChange={(e) => updateFormData('baseRate', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interest Rate Margin %
              </label>
              <input
                type="number"
                value={(formData.interestRateMargin * 100).toFixed(2)}
                onChange={(e) => updateFormData('interestRateMargin', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>

            <div className="bg-navy-800/50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">All-in Interest Rate:</span>
                <span className="text-gray-100 font-medium">
                  {((formData.baseRate + formData.interestRateMargin) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Operating Costs</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Annual Staff Expenses
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={formData.staffExpenses}
                  onChange={(e) => updateFormData('staffExpenses', parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Annual Salary Growth %
              </label>
              <input
                type="number"
                value={(formData.salaryGrowth * 100).toFixed(2)}
                onChange={(e) => updateFormData('salaryGrowth', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Other Cost Items
              </label>
              <div className="space-y-2">
                {formData.costItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateCostItem(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Cost name (e.g., Rent, Marketing)"
                    />
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateCostItem(index, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-32 pl-8 pr-2 py-2 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeCostItem(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addCostItem}
                  className="w-full mt-2 py-2 px-4 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-navy-700 hover:border-navy-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Cost Item
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Revenue Growth Rate % (Annual)
              </label>
              <input
                type="number"
                value={(formData.revenueGrowth * 100).toFixed(1)}
                onChange={(e) => updateFormData('revenueGrowth', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.5"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Exit Assumptions</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Disposal Costs %
              </label>
              <input
                type="number"
                value={(formData.disposalCosts * 100).toFixed(2)}
                onChange={(e) => updateFormData('disposalCosts', parseFloat(e.target.value) / 100)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Terminal Equity Multiple (x EBITDA)
              </label>
              <input
                type="number"
                value={formData.terminalMultiple}
                onChange={(e) => updateFormData('terminalMultiple', parseFloat(e.target.value))}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                step="0.5"
                min="1"
                max="30"
              />
            </div>

            <div className="bg-navy-800/50 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Deal Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Deal Name:</span>
                  <span className="text-gray-100">{formData.name || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-gray-100">{dealTypes.find(t => t.value === formData.dealType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Purchase Price:</span>
                  <span className="text-gray-100">{formData.currency}{formData.purchasePrice}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holding Period:</span>
                  <span className="text-gray-100">{formData.holdingPeriodMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exit Multiple:</span>
                  <span className="text-gray-100">{formData.terminalMultiple}x</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
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
          className="bg-navy-900 rounded-2xl p-8 max-w-2xl w-full border border-navy-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Create New Deal</h2>
              <p className="text-sm text-gray-400 mt-1">Step {currentStep} of {totalSteps}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-navy-800 rounded-full h-2 mb-8">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 bg-navy-800 text-gray-300 rounded-lg font-medium hover:bg-navy-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
              
              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.name || !formData.purchasePrice}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Create Deal & Build Model
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}