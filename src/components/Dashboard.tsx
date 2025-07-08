import React, { useState, useEffect } from 'react';
import { User, HealthMetrics, MentalWellness, Prediction } from '../types';
import { DashboardHeader } from './DashboardHeader';
import { HealthOverview } from './HealthOverview';
import { MentalWellnessTracker } from './MentalWellnessTracker';
import { PredictionPanel } from './PredictionPanel';
import { GoalsPanel } from './GoalsPanel';
import { RecipeTimetable } from './RecipeTimetable';
import { calculateBMI, generateHealthPrediction, generateMentalHealthScore } from '../utils/healthCalculations';
import { ProfileEdit } from './ProfileEdit';
import { Chatbot } from './Chatbot';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics[]>([]);
  const [mentalWellness, setMentalWellness] = useState<MentalWellness[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'mental' | 'predictions' | 'goals' | 'recipes' | 'chatbot'>('overview');
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  useEffect(() => {
    // Load sample data
    const sampleMetrics: HealthMetrics[] = [
      {
        id: '1',
        userId: user.id,
        weight: user.weight,
        bmi: calculateBMI(user.weight, user.height),
        date: new Date()
      }
    ];

    const sampleWellness: MentalWellness[] = [
      {
        id: '1',
        userId: user.id,
        mood: 7,
        stressLevel: 4,
        sleepQuality: 8,
        energyLevel: 6,
        anxiety: 3,
        date: new Date()
      }
    ];

    setHealthMetrics(sampleMetrics);
    setMentalWellness(sampleWellness);

    // Generate initial prediction
    const prediction = generateHealthPrediction(user, sampleMetrics, sampleWellness);
    setPredictions([prediction]);
  }, [user]);

  const addWellnessEntry = (entry: Omit<MentalWellness, 'id' | 'userId' | 'date'>) => {
    const newEntry: MentalWellness = {
      id: Date.now().toString(),
      userId: user.id,
      date: new Date(),
      ...entry
    };
    setMentalWellness(prev => [...prev, newEntry]);
    
    // Update predictions
    const updatedPrediction = generateHealthPrediction(user, healthMetrics, [...mentalWellness, newEntry]);
    setPredictions(prev => [...prev, updatedPrediction]);
  };

  const mentalHealthScore = generateMentalHealthScore(mentalWellness);

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader user={user} onLogout={onLogout} onEditProfile={() => setShowProfileEdit(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 rounded-xl p-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'mental', label: 'Mental Health', icon: '🧠' },
            { id: 'predictions', label: 'Predictions', icon: '🔮' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
            { id: 'recipes', label: 'Recipes', icon: '🍲' },
            { id: 'chatbot', label: 'Chatbot', icon: '💬' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <HealthOverview
              user={user}
              healthMetrics={healthMetrics}
              mentalHealthScore={mentalHealthScore}
              latestPrediction={predictions[predictions.length - 1]}
            />
          )}

          {activeTab === 'mental' && (
            <MentalWellnessTracker
              mentalWellness={mentalWellness}
              onAddEntry={addWellnessEntry}
              mentalHealthScore={mentalHealthScore}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionPanel
              predictions={predictions}
              user={user}
              healthMetrics={healthMetrics}
              mentalWellness={mentalWellness}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsPanel user={user} />
          )}

          {activeTab === 'recipes' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Weekly South Indian Fitness Recipes</h2>
              <RecipeTimetable />
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">Mental Wellness Chatbot</h2>
              <Chatbot />
            </div>
          )}
        </div>
      </div>
      {/* Profile Edit Modal Placeholder */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowProfileEdit(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Profile</h2>
            <ProfileEdit
              user={user}
              onSave={({ height, weight }) => {
                onUpdateUser({ height, weight });
                setShowProfileEdit(false);
              }}
              onCancel={() => setShowProfileEdit(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};