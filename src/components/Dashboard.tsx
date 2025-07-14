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
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot, { ChatbotPanel } from './Chatbot';

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 relative">
      <DashboardHeader user={user} onLogout={onLogout} onEditProfile={() => setShowProfileEdit(true)} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-xl p-2 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'mental', label: 'Mental Health', icon: '🧠' },
            { id: 'predictions', label: 'Predictions', icon: '🔮' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
            { id: 'recipes', label: 'Recipes', icon: '🍲' },
            { id: 'chatbot', label: 'Chatbot', icon: '💬' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 text-lg tracking-wide shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 ${
                activeTab === tab.id
                  ? 'bg-white scale-105 shadow-xl border-2 border-pink-400'
                  : 'hover:text-pink-100 hover:bg-white/20'
              }`}
              style={{
                boxShadow: activeTab === tab.id ? '0 4px 24px 0 rgba(236,72,153,0.18)' : undefined,
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              }}
            >
              <span className="mr-2 text-2xl">{tab.icon}</span>
              <span className="text-black">{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Tab Content with 3D Animation */}
        <div className="space-y-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <HealthOverview
                  user={user}
                  healthMetrics={healthMetrics}
                  mentalHealthScore={mentalHealthScore}
                  latestPrediction={predictions[predictions.length - 1]}
                />
              </motion.div>
            )}
            {activeTab === 'mental' && (
              <motion.div
                key="mental"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <MentalWellnessTracker
                  mentalWellness={mentalWellness}
                  onAddEntry={addWellnessEntry}
                  mentalHealthScore={mentalHealthScore}
                />
              </motion.div>
            )}
            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <PredictionPanel
                  predictions={predictions}
                  user={user}
                  healthMetrics={healthMetrics}
                  mentalWellness={mentalWellness}
                  onAddWellnessEntry={addWellnessEntry}
                />
              </motion.div>
            )}
            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <GoalsPanel user={user} />
              </motion.div>
            )}
            {activeTab === 'recipes' && (
              <motion.div
                key="recipes"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-pink-600">Weekly South Indian Fitness Recipes</h2>
                  <RecipeTimetable />
                </div>
              </motion.div>
            )}
            {activeTab === 'chatbot' && (
              <motion.div
                key="chatbot"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, type: 'spring' }}
                style={{ perspective: 1200 }}
              >
                <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-pink-600">Wellness Chatbot</h2>
                  <ChatbotPanel onSentiment={(score, label) => {
                    // Map sentiment score (-5 to 5) to mood (1-10)
                    const mood = Math.max(1, Math.min(10, 5 + score));
                    addWellnessEntry({
                      mood,
                      stressLevel: label === 'Negative' ? 8 : label === 'Positive' ? 3 : 5,
                      sleepQuality: 5,
                      energyLevel: label === 'Positive' ? 7 : label === 'Negative' ? 3 : 5,
                      anxiety: label === 'Negative' ? 8 : label === 'Positive' ? 3 : 5,
                      notes: `Chatbot entry (score: ${score}, label: ${label})`,
                    });
                  }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
      {/* Medical-themed mouse cursor effect placeholder (add CSS in index.css) */}
    </div>
  );
};