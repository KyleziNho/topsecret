import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Percent, Target } from 'lucide-react';

interface ModelPreviewProps {
  deal: any;
  inputs: any;
}

export function ModelPreview({ deal, inputs }: ModelPreviewProps) {
  const calculateMetrics = () => {
    const revenue = inputs.revenue.baseRevenue;
    const growthRate = inputs.revenue.growthRate;
    const exitYear = inputs.exit.exitYear;
    const exitMultiple = inputs.exit.exitMultiple;
    
    const projectedRevenue = revenue * Math.pow(1 + growthRate, exitYear);
    const ebitdaMargin = 1 - inputs.costs.cogs - inputs.costs.opex;
    const projectedEBITDA = projectedRevenue * ebitdaMargin;
    const exitValue = projectedEBITDA * exitMultiple;
    
    const totalInvestment = parseFloat(deal.dealSize);
    const moic = exitValue / totalInvestment;
    const irr = Math.pow(moic, 1 / exitYear) - 1;

    return {
      projectedRevenue,
      projectedEBITDA,
      exitValue,
      moic,
      irr,
      ebitdaMargin,
    };
  };

  const metrics = calculateMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-navy-900 rounded-xl p-6 border border-navy-800 sticky top-6"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Returns Preview</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Target IRR</span>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-400">{deal.targetIRR}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Projected IRR</span>
            <span className={`font-bold text-lg ${
              metrics.irr * 100 >= parseFloat(deal.targetIRR) 
                ? 'text-emerald-400' 
                : 'text-amber-400'
            }`}>
              {(metrics.irr * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Exit Value</span>
            </div>
            <span className="font-semibold text-gray-100">
              ${metrics.exitValue.toFixed(0)}M
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">MOIC</span>
            </div>
            <span className="font-semibold text-gray-100">
              {metrics.moic.toFixed(2)}x
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">EBITDA Margin</span>
            </div>
            <span className="font-semibold text-gray-100">
              {(metrics.ebitdaMargin * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Year {inputs.exit.exitYear} EBITDA</span>
            </div>
            <span className="font-semibold text-gray-100">
              ${metrics.projectedEBITDA.toFixed(0)}M
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-navy-800 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Live preview updates as you adjust inputs
          </p>
        </div>
      </div>
    </motion.div>
  );
}