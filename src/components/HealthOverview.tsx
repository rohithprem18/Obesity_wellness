import React from 'react';
import { Scale, Activity, Heart, TrendingUp } from 'lucide-react';
import { User, HealthMetrics, Prediction } from '../types';
import { calculateBMI, getBMICategory } from '../utils/healthCalculations';

interface HealthOverviewProps {
  user: User;
  healthMetrics: HealthMetrics[];
  mentalHealthScore: number;
  latestPrediction?: Prediction;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({
  user,
  healthMetrics,
  mentalHealthScore,
  latestPrediction
}) => {
  const currentBMI = calculateBMI(user.weight, user.height);
  const bmiCategory = getBMICategory(currentBMI);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* BMI Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Scale className="w-8 h-8 text-purple-400" />
          <span className="text-gray-600 text-sm">BMI</span>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-black">{currentBMI}</div>
          <div className="text-sm text-gray-600">{bmiCategory}</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                currentBMI < 18.5 ? 'bg-blue-500' :
                currentBMI < 25 ? 'bg-green-500' :
                currentBMI < 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((currentBMI / 35) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weight Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Activity className="w-8 h-8 text-green-400" />
          <span className="text-gray-600 text-sm">Weight</span>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-black">{user.weight} kg</div>
          <div className="text-sm text-gray-600">Current weight</div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">On track</span>
          </div>
        </div>
      </div>

      {/* Mental Health Score */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Heart className="w-8 h-8 text-pink-400" />
          <span className="text-gray-600 text-sm">Mental Health</span>
        </div>
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${getScoreColor(mentalHealthScore)}`}>
            {mentalHealthScore}%
          </div>
          <div className="text-sm text-gray-600">Overall score</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                mentalHealthScore >= 70 ? 'bg-green-500' :
                mentalHealthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${mentalHealthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className="w-8 h-8 text-orange-400" />
          <span className="text-gray-600 text-sm">Risk Level</span>
        </div>
        <div className="space-y-2">
          <div className={`text-2xl font-bold capitalize ${getRiskColor(latestPrediction?.riskLevel || 'low').split(' ')[0]}`}>
            {latestPrediction?.riskLevel || 'Low'}
          </div>
          <div className="text-sm text-gray-600">Overall risk</div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(latestPrediction?.riskLevel || 'low')}`}>
            {Math.round((latestPrediction?.confidence || 0.7) * 100)}% confidence
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {latestPrediction && (
        <div className="col-span-full bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-black mb-4">🎯 Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPrediction.recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-800 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};