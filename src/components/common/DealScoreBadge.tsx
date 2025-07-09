import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { DealScore, DealScoringService } from '@/services/dealScoring';
import { motion, AnimatePresence } from 'framer-motion';

interface DealScoreBadgeProps {
  score: DealScore;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const DealScoreBadge: React.FC<DealScoreBadgeProps> = ({
  score,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = DealScoringService.getCategoryColor(score.category);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };
  
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full font-medium
          ${sizeClasses[size]} ${colors.bg} ${colors.text} ${colors.border}
          border cursor-help transition-all duration-200
          hover:shadow-md hover:scale-105
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`bg-gradient-to-r ${colors.gradient} text-white rounded-full p-1`}>
          <TrendingUp className={iconSize[size]} />
        </div>
        <span className="font-semibold">{score.total}</span>
        <span className="uppercase tracking-wider opacity-80">
          {score.category}
        </span>
      </div>

      <AnimatePresence>
        {showDetails && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-80 p-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Deal Score Breakdown
                </h4>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {score.total}
                </span>
              </div>

              <div className="space-y-2">
                <ScoreBar
                  label="Persona Match"
                  value={score.breakdown.personaScore}
                  max={20}
                  color="blue"
                />
                <ScoreBar
                  label="Company Size"
                  value={score.breakdown.companyScore}
                  max={20}
                  color="purple"
                />
                <ScoreBar
                  label="Industry Fit"
                  value={score.breakdown.industryScore}
                  max={20}
                  color="green"
                />
                <ScoreBar
                  label="Contact Info"
                  value={score.breakdown.completenessScore}
                  max={20}
                  color="yellow"
                />
                <ScoreBar
                  label="Engagement"
                  value={score.breakdown.interactionScore}
                  max={20}
                  color="pink"
                />
              </div>

              {score.reasons.length > 0 && (
                <div className="pt-3 border-t">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Key Factors:
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {score.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t text-xs text-gray-500">
                <p className="font-medium mb-1">Score Categories:</p>
                <div className="grid grid-cols-2 gap-1">
                  <span>🔥 Hot: 80-100</span>
                  <span>☀️ Warm: 60-79</span>
                  <span>❄️ Cool: 40-59</span>
                  <span>🧊 Cold: 0-39</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500'
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]}`}
        />
      </div>
    </div>
  );
};

export default DealScoreBadge;