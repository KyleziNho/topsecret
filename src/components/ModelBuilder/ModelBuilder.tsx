import { motion } from 'framer-motion';
import { useState } from 'react';
import { Download, MessageSquare, FileSpreadsheet } from 'lucide-react';
import { generateExcelModel } from '../../services/excelGenerator';
import { ModelInputs } from './ModelInputs';
import { ModelPreview } from './ModelPreview';

interface ModelBuilderProps {
  deal: any;
  onOpenChat: () => void;
}

export function ModelBuilder({ deal, onOpenChat }: ModelBuilderProps) {
  const [modelInputs, setModelInputs] = useState({
    revenue: {
      baseYear: deal.revenue?.baseYear || new Date().getFullYear(),
      baseRevenue: deal.revenue?.baseRevenue || 100,
      growthRate: deal.revenueGrowth || deal.revenue?.growthRate || 0.1,
      years: Math.ceil((deal.holdingPeriodMonths || 24) / 12),
    },
    costs: {
      cogs: deal.costs?.cogs || 0.6,
      opex: deal.costs?.opex || 0.2,
      capex: deal.costs?.capex || 0.05,
    },
    financing: {
      debtAmount: deal.financing?.debtAmount || parseFloat(deal.dealSize || '0') * (deal.acquisitionLTV || 0.6),
      interestRate: deal.financing?.interestRate || (deal.baseRate || 0.01) + (deal.interestRateMargin || 0.02),
      term: deal.financing?.term || 7,
      equityAmount: deal.financing?.equityAmount || parseFloat(deal.dealSize || '0') * (1 - (deal.acquisitionLTV || 0.6)),
    },
    exit: {
      exitMultiple: deal.terminalMultiple || deal.exit?.exitMultiple || 12,
      exitYear: Math.ceil((deal.holdingPeriodMonths || 24) / 12),
    },
    // Add new properties from deal form
    reportingFrequency: deal.reportingFrequency || 'monthly',
    holdingPeriodMonths: deal.holdingPeriodMonths || 24,
    acquisitionDate: deal.acquisitionDate,
    currency: deal.currency || '$',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateModel = async () => {
    setIsGenerating(true);
    try {
      // Pass both deal data and model inputs with all the form data
      const fullInputs = {
        ...modelInputs,
        ...deal, // Include all deal form data
      };
      await generateExcelModel(deal, fullInputs);
    } catch (error) {
      console.error('Error generating model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating Excel file: ${errorMessage}\nPlease check your inputs and try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">{deal.name} - Financial Model</h1>
          <p className="text-gray-400 mt-1">
            {deal.company || deal.name} • {deal.currency || '$'}{parseFloat(deal.dealSize || '0').toFixed(0)}M {(deal.dealType || 'acquisition').toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenChat}
            className="px-4 py-2 bg-navy-800 text-gray-300 rounded-lg font-medium flex items-center gap-2 hover:bg-navy-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            AI Assistant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateModel}
            disabled={isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Excel
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModelInputs 
            inputs={modelInputs} 
            onChange={setModelInputs}
            dealType={deal.dealType}
          />
        </div>
        
        <div className="space-y-6">
          <ModelPreview 
            deal={deal}
            inputs={modelInputs}
          />
        </div>
      </div>

      <div className="bg-navy-900 rounded-xl p-6 border border-navy-800">
        <div className="flex items-center gap-3 mb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-100">Model Structure</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'Assumptions',
            'Debt Schedule',
            'Revenue Model',
            'P&L Statement',
            'Cash Flow',
            'Returns Analysis',
          ].map((sheet) => (
            <div
              key={sheet}
              className="bg-navy-800 rounded-lg p-3 border border-navy-700"
            >
              <div className="text-sm font-medium text-gray-300">{sheet}</div>
              <div className="text-xs text-gray-500 mt-1">Auto-generated</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}