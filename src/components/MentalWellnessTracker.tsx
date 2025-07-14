import React, { useState } from 'react';
import { Plus, Smile, Frown, Meh } from 'lucide-react';
import { MentalWellness } from '../types';

interface MentalWellnessTrackerProps {
  mentalWellness: MentalWellness[];
  onAddEntry: (entry: Omit<MentalWellness, 'id' | 'userId' | 'date'>) => void;
  mentalHealthScore: number;
}

export const MentalWellnessTracker: React.FC<MentalWellnessTrackerProps> = ({
  mentalWellness,
  onAddEntry,
  mentalHealthScore
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: 5,
    stressLevel: 5,
    sleepQuality: 5,
    energyLevel: 5,
    anxiety: 5,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(formData);
    setFormData({
      mood: 5,
      stressLevel: 5,
      sleepQuality: 5,
      energyLevel: 5,
      anxiety: 5,
      notes: ''
    });
    setShowForm(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="w-5 h-5 text-green-400" />;
    if (mood >= 4) return <Meh className="w-5 h-5 text-yellow-400" />;
    return <Frown className="w-5 h-5 text-red-400" />;
  };

  const SliderInput = ({ label, value, onChange, min = 1, max = 10, invert = false }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    invert?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-black font-medium">{label}</label>
        <span className={`text-lg font-bold ${
          invert ? 
            (value <= 3 ? 'text-green-400' : value <= 6 ? 'text-yellow-400' : 'text-red-400') :
            (value >= 7 ? 'text-green-400' : value >= 4 ? 'text-yellow-400' : 'text-red-400')
        }`}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{invert ? 'Low' : 'Poor'}</span>
        <span>{invert ? 'High' : 'Excellent'}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Mental Health Score Overview */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Mental Health Score</h2>
          <div className={`text-6xl font-bold ${getScoreColor(mentalHealthScore)} mb-4`}>
            {mentalHealthScore}%
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                mentalHealthScore >= 70 ? 'bg-green-500' :
                mentalHealthScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${mentalHealthScore}%` }}
            />
          </div>
          <p className="text-gray-600">
            {mentalHealthScore >= 70 ? 'Great job! Your mental health is in excellent shape.' :
             mentalHealthScore >= 50 ? 'Good progress! Keep focusing on your mental wellness.' :
             'Your mental health needs attention. Consider the recommendations below.'}
          </p>
        </div>
      </div>

      {/* Add New Entry Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Wellness Check-in</span>
        </button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-black mb-6">How are you feeling today?</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <SliderInput
                label="Overall Mood"
                value={formData.mood}
                onChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
              />
              
              <SliderInput
                label="Stress Level"
                value={formData.stressLevel}
                onChange={(value) => setFormData(prev => ({ ...prev, stressLevel: value }))}
                invert
              />
              
              <SliderInput
                label="Sleep Quality"
                value={formData.sleepQuality}
                onChange={(value) => setFormData(prev => ({ ...prev, sleepQuality: value }))}
              />
              
              <SliderInput
                label="Energy Level"
                value={formData.energyLevel}
                onChange={(value) => setFormData(prev => ({ ...prev, energyLevel: value }))}
              />
              
              <SliderInput
                label="Anxiety Level"
                value={formData.anxiety}
                onChange={(value) => setFormData(prev => ({ ...prev, anxiety: value }))}
                invert
              />
              
              <div className="space-y-2">
                <label className="text-black font-medium">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling? Any specific thoughts or concerns?"
                  className="w-full p-3 bg-white/10 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-white/10 text-black font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-black mb-4">Recent Check-ins</h3>
        <div className="space-y-4">
          {mentalWellness.slice(-5).reverse().map((entry, index) => (
            <div key={entry.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getMoodIcon(entry.mood)}
                  <span className="text-black font-medium">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-600 text-sm">
                  {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mood:</span>
                    <span className="text-black">{entry.mood}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy:</span>
                    <span className="text-black">{entry.energyLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sleep:</span>
                    <span className="text-black">{entry.sleepQuality}/10</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stress:</span>
                    <span className="text-black">{entry.stressLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anxiety:</span>
                    <span className="text-black">{entry.anxiety}/10</span>
                  </div>
                </div>
              </div>
              {entry.notes && (
                <div className="mt-2 p-2 bg-white/5 rounded text-gray-700 text-sm">
                  "{entry.notes}"
                </div>
              )}
            </div>
          ))}
          {mentalWellness.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No check-ins yet. Start tracking your mental wellness today!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};