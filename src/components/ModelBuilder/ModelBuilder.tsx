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
      baseYear: new Date().getFullYear(),
      baseRevenue: 100,
      growthRate: 0.1,
      years: 5,
    },
    costs: {
      cogs: 0.6,
      opex: 0.2,
      capex: 0.05,
    },
    financing: {
      debtAmount: parseFloat(deal.dealSize) * 0.6,
      interestRate: 0.08,
      term: 7,
      equityAmount: parseFloat(deal.dealSize) * 0.4,
    },
    exit: {
      exitMultiple: 12,
      exitYear: 5,
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateModel = async () => {
    setIsGenerating(true);
    try {
      await generateExcelModel(deal, modelInputs);
    } catch (error) {
      console.error('Error generating model:', error);
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
            {deal.company} • ${deal.dealSize} {deal.dealType.toUpperCase()}
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