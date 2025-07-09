import { TrendingUp, TrendingDown, Minus, Clock, Calendar, Target, AlertCircle } from 'lucide-react';
import { SuccessPrediction } from '@/services/successPrediction';

interface SuccessPredictionDisplayProps {
  prediction: SuccessPrediction;
  compact?: boolean;
}

export function SuccessPredictionDisplay({ prediction, compact = false }: SuccessPredictionDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-orange-600';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex-shrink-0">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBackground(prediction.score)}`}>
            <span className={`text-2xl font-bold ${getScoreColor(prediction.score)}`}>
              {prediction.score}%
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">Success Probability</span>
            <span className={`text-xs ${getConfidenceColor(prediction.confidence)}`}>
              {prediction.confidence} confidence
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{prediction.bestTimeToCall.dayOfWeek}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{prediction.bestTimeToCall.timeRange}</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(prediction.factors.overallTrend)}
              <span className="capitalize">{prediction.factors.overallTrend}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Score Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Call Success Prediction</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on historical data and current conditions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
              {prediction.confidence} confidence
            </span>
            {getTrendIcon(prediction.factors.overallTrend)}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-8">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(prediction.score)}`}>
              <div className="text-center">
                <span className={`text-3xl font-bold ${getScoreColor(prediction.score)}`}>
                  {prediction.score}%
                </span>
                <p className="text-xs text-gray-600 mt-1">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Best Time to Call</p>
              <p className="font-medium text-gray-900">
                {prediction.bestTimeToCall.dayOfWeek}, {prediction.bestTimeToCall.timeRange}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Trend</p>
              <p className="font-medium text-gray-900 capitalize">{prediction.factors.overallTrend}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contributing Factors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Contributing Factors</h4>
        <div className="space-y-3">
          <FactorBar label="Persona Success Rate" value={prediction.factors.personaSuccessRate} />
          <FactorBar label="Industry Success Rate" value={prediction.factors.industrySuccessRate} />
          <FactorBar label="Time of Day Score" value={prediction.factors.timeOfDayScore} />
          <FactorBar label="Day of Week Score" value={prediction.factors.dayOfWeekScore} />
          <FactorBar label="Previous Interactions" value={prediction.factors.previousInteractionScore} />
        </div>
      </div>

      {/* Recommendations */}
      {prediction.recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="text-sm font-semibold text-gray-900">Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {prediction.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FactorBar({ label, value }: { label: string; value: number }) {
  const getBarColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}