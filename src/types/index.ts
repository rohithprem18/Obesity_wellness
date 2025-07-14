export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  healthGoals: string[];
  createdAt: Date;
}

export interface HealthMetrics {
  id: string;
  userId: string;
  weight: number;
  bmi: number;
  bodyFat?: number;
  muscleMass?: number;
  date: Date;
}

export interface MentalWellness {
  id: string;
  userId: string;
  mood: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  sleepQuality: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  notes?: string;
  date: Date;
}

export interface Prediction {
  id: string;
  userId: string;
  type: 'obesity' | 'mental-health' | 'overall';
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  factors: string[];
  recommendations: string[];
  date: Date;
}

export interface WellnessGoal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  category: 'physical' | 'mental' | 'nutrition';
  deadline: Date;
  completed: boolean;
}