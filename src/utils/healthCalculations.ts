import { User, HealthMetrics, MentalWellness, Prediction } from '../types';

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateIdealWeight = (height: number, gender: 'male' | 'female' = 'male'): number => {
  const baseWeight = gender === 'male' ? 50 : 45.5;
  const additionalWeight = gender === 'male' ? 2.3 : 2.3;
  const heightInInches = height / 2.54;
  return Math.round(baseWeight + (additionalWeight * (heightInInches - 60)));
};

export const generateHealthPrediction = (
  user: User,
  metrics: HealthMetrics[],
  wellness: MentalWellness[]
): Prediction => {
  const latestMetrics = metrics[metrics.length - 1];
  const latestWellness = wellness[wellness.length - 1];
  
  const bmi = latestMetrics?.bmi || calculateBMI(user.weight, user.height);
  const avgMood = wellness.length > 0 ? wellness.reduce((sum, w) => sum + w.mood, 0) / wellness.length : 5;
  const avgStress = wellness.length > 0 ? wellness.reduce((sum, w) => sum + w.stressLevel, 0) / wellness.length : 5;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0.7;
  const factors: string[] = [];
  const recommendations: string[] = [];
  
  // Obesity risk assessment
  if (bmi >= 30) {
    riskLevel = 'high';
    factors.push('BMI indicates obesity');
    recommendations.push('Consult a healthcare provider for weight management');
    recommendations.push('Consider a structured diet and exercise program');
  } else if (bmi >= 25) {
    if (riskLevel !== 'high') riskLevel = 'medium';
    factors.push('BMI indicates overweight');
    recommendations.push('Focus on balanced nutrition and regular exercise');
  }
  
  // Mental health risk assessment
  if (avgMood < 4) {
    riskLevel = 'high';
    factors.push('Consistently low mood ratings');
    recommendations.push('Consider speaking with a mental health professional');
    recommendations.push('Practice mindfulness and stress reduction techniques');
  } else if (avgMood < 6) {
    if (riskLevel !== 'high') riskLevel = 'medium';
    factors.push('Below average mood ratings');
    recommendations.push('Engage in activities that boost mood and energy');
  }
  
  if (avgStress > 7) {
    riskLevel = 'high';
    factors.push('High stress levels');
    recommendations.push('Practice stress management techniques');
    recommendations.push('Consider meditation or yoga');
  }
  
  // Activity level assessment
  if (user.activityLevel === 'sedentary') {
    if (riskLevel !== 'high') riskLevel = 'medium';
    factors.push('Sedentary lifestyle');
    recommendations.push('Gradually increase physical activity');
    recommendations.push('Aim for at least 150 minutes of moderate exercise weekly');
  }
  
  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push('Maintain current healthy habits');
    recommendations.push('Continue regular health monitoring');
    recommendations.push('Stay hydrated and get adequate sleep');
  }

  // --- Dynamic Confidence Calculation ---
  // 1. Data completeness (more entries = higher confidence)
  const maxEntries = 30; // arbitrary, for normalization
  const healthDataScore = Math.min(metrics.length / maxEntries, 1);
  const wellnessDataScore = Math.min(wellness.length / maxEntries, 1);

  // 2. Recency (latest entry within 7 days)
  let recencyScore = 0.5;
  const now = new Date();
  if (latestMetrics && latestWellness) {
    const daysSinceMetric = (now.getTime() - new Date(latestMetrics.date).getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceWellness = (now.getTime() - new Date(latestWellness.date).getTime()) / (1000 * 60 * 60 * 24);
    recencyScore = (daysSinceMetric <= 7 && daysSinceWellness <= 7) ? 1 : 0.5;
  }

  // 3. Consistency (lower variance = higher confidence)
  function variance(arr: number[]): number {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / arr.length;
  }
  const moodVariance = variance(wellness.map(w => w.mood));
  const stressVariance = variance(wellness.map(w => w.stressLevel));
  // Normalize: lower variance (<=2) = 1, higher variance (>=8) = 0
  const consistencyScore = 1 - Math.min((moodVariance + stressVariance) / 16, 1);

  // 4. Number of risk factors (more = lower confidence)
  const riskFactorPenalty = Math.max(0, 1 - (factors.length / 6)); // 6+ factors = 0

  // Combine all (weighted average)
  confidence = (
    0.25 * healthDataScore +
    0.25 * wellnessDataScore +
    0.2 * recencyScore +
    0.2 * consistencyScore +
    0.1 * riskFactorPenalty
  );
  // Clamp between 0.5 and 0.99
  confidence = Math.max(0.5, Math.min(confidence, 0.99));

  return {
    id: Date.now().toString(),
    userId: user.id,
    type: 'overall',
    riskLevel,
    confidence,
    factors,
    recommendations,
    date: new Date()
  };
};

export const generateMentalHealthScore = (wellness: MentalWellness[]): number => {
  if (wellness.length === 0) return 50;
  
  const recent = wellness.slice(-7); // Last 7 entries
  const avgMood = recent.reduce((sum, w) => sum + w.mood, 0) / recent.length;
  const avgStress = recent.reduce((sum, w) => sum + (11 - w.stressLevel), 0) / recent.length; // Invert stress
  const avgSleep = recent.reduce((sum, w) => sum + w.sleepQuality, 0) / recent.length;
  const avgEnergy = recent.reduce((sum, w) => sum + w.energyLevel, 0) / recent.length;
  const avgAnxiety = recent.reduce((sum, w) => sum + (11 - w.anxiety), 0) / recent.length; // Invert anxiety
  
  return Math.round(((avgMood + avgStress + avgSleep + avgEnergy + avgAnxiety) / 5) * 10);
};