import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Brain, Heart } from 'lucide-react';
import { User, HealthMetrics, MentalWellness, Prediction } from '../types';
import Chatbot, { ChatbotPanel } from './Chatbot';

interface PredictionPanelProps {
  predictions: Prediction[];
  user: User;
  healthMetrics: HealthMetrics[];
  mentalWellness: MentalWellness[];
  onAddWellnessEntry?: (entry: Omit<MentalWellness, 'id' | 'userId' | 'date'>) => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  predictions,
  user,
  healthMetrics,
  mentalWellness,
  onAddWellnessEntry
}) => {
  const latestPrediction = predictions[predictions.length - 1];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-6 h-6" />;
      case 'medium': return <TrendingUp className="w-6 h-6" />;
      case 'high': return <AlertTriangle className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getHealthInsights = () => {
    const insights = [];
    
    if (latestPrediction) {
      const bmi = healthMetrics.length > 0 ? healthMetrics[healthMetrics.length - 1].bmi : 0;
      const avgMood = mentalWellness.length > 0 ? 
        mentalWellness.reduce((sum, w) => sum + w.mood, 0) / mentalWellness.length : 0;
      
      if (bmi > 25) {
        insights.push({
          icon: <Heart className="w-5 h-5 text-red-400" />,
          title: 'Weight Management',
          description: `Your BMI of ${bmi.toFixed(1)} indicates overweight. Focus on balanced nutrition and regular exercise.`,
          urgency: 'medium'
        });
      }
      
      if (avgMood < 6) {
        insights.push({
          icon: <Brain className="w-5 h-5 text-yellow-400" />,
          title: 'Mental Wellness',
          description: `Your average mood score is ${avgMood.toFixed(1)}/10. Consider stress management techniques.`,
          urgency: 'medium'
        });
      }
      
      if (user.activityLevel === 'sedentary') {
        insights.push({
          icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
          title: 'Activity Level',
          description: 'Sedentary lifestyle increases health risks. Gradually increase physical activity.',
          urgency: 'high'
        });
      }
    }
    
    return insights;
  };

  const insights = getHealthInsights();

  return (
    <div className="space-y-6">
      {/* Chatbot Panel for Health Risk Assessment */}
      {/* Risk Assessment Card */}
      {latestPrediction && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Health Risk Assessment</h2>
            <div className="text-gray-600 text-sm">Updated {latestPrediction.date.toLocaleDateString()}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border ${getRiskColor(latestPrediction.riskLevel)}`}>
              <div className="flex items-center space-x-3 mb-4">
                {getRiskIcon(latestPrediction.riskLevel)}
                <h3 className="text-lg font-semibold capitalize">{latestPrediction.riskLevel} Risk</h3>
              </div>
              <p className="text-sm opacity-80">
                Overall health risk based on current metrics and lifestyle factors.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-black">Confidence</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {Math.round(latestPrediction.confidence * 100)}%
              </div>
              <p className="text-sm text-gray-600">
                Prediction accuracy based on available data.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-black">Factors</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {latestPrediction.factors.length}
              </div>
              <p className="text-sm text-gray-600">
                Risk factors identified in your profile.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {latestPrediction && latestPrediction.factors.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-black mb-4">⚠️ Identified Risk Factors</h3>
          <div className="space-y-3">
            {latestPrediction.factors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-black/90">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Insights */}
      {insights.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-black mb-4">🔍 Health Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                insight.urgency === 'high' ? 'bg-red-500/10 border-red-500/20' :
                insight.urgency === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                'bg-green-500/10 border-green-500/20'
              }`}>
                <div className="flex items-start space-x-3">
                  {insight.icon}
                  <div>
                    <h4 className="font-semibold text-black mb-1">{insight.title}</h4>
                    <p className="text-gray-800 text-sm">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      {latestPrediction && latestPrediction.recommendations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-black mb-4">💡 Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPrediction.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-800 text-sm">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prediction History */}
      {predictions.length > 1 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-black mb-4">📊 Prediction History</h3>
          <div className="space-y-4">
            {predictions.slice(-5).reverse().map((prediction, index) => (
              <div key={prediction.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(prediction.riskLevel)}
                    <span className={`font-semibold capitalize ${getRiskColor(prediction.riskLevel).split(' ')[0]}`}>
                      {prediction.riskLevel} Risk
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {prediction.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-800 text-sm">
                  Confidence: {Math.round(prediction.confidence * 100)}% | 
                  Factors: {prediction.factors.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};