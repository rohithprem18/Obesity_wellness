import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Activity, Target } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (userData: any) => Promise<boolean>;
  onToggleForm: () => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onToggleForm, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'moderate' as const,
    healthGoals: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const healthGoalOptions = [
    { id: 'lose-weight', label: 'Lose Weight', icon: '🏃‍♂️' },
    { id: 'gain-muscle', label: 'Gain Muscle', icon: '💪' },
    { id: 'improve-mood', label: 'Improve Mood', icon: '😊' },
    { id: 'reduce-stress', label: 'Reduce Stress', icon: '🧘‍♀️' },
    { id: 'better-sleep', label: 'Better Sleep', icon: '😴' },
    { id: 'increase-energy', label: 'Increase Energy', icon: '⚡' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
    { id: 'light', label: 'Light', desc: 'Light exercise 1-3 days/week' },
    { id: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3-5 days/week' },
    { id: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
    { id: 'very-active', label: 'Very Active', desc: 'Physical job + exercise' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goalId)
        ? prev.healthGoals.filter(id => id !== goalId)
        : [...prev.healthGoals, goalId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all fields');
        return;
      }
      setStep(2);
      return;
    }

    if (!formData.age || !formData.height || !formData.weight) {
      setError('Please fill in all fields');
      return;
    }

    const success = await onSubmit({
      ...formData,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight)
    });
    
    if (!success) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-800" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">Join WellnessAI</h2>
          <p className="text-gray-600">Start your health transformation</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-green-500' : 'bg-white/20'}`} />
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-green-500' : 'bg-white/20'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-white/20'}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-3">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map(level => (
                    <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.id}
                        checked={formData.activityLevel === level.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value as any }))}
                        className="w-4 h-4 text-green-500 focus:ring-green-500 focus:ring-offset-transparent"
                      />
                      <div>
                        <div className="text-black font-medium">{level.label}</div>
                        <div className="text-gray-400 text-sm">{level.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-3">Health Goals</label>
                <div className="grid grid-cols-2 gap-3">
                  {healthGoalOptions.map(goal => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.healthGoals.includes(goal.id)
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-white/10 border-gray-200 text-black hover:bg-white/20'
                      }`}
                    >
                      <div className="text-lg mb-1">{goal.icon}</div>
                      <div className="text-sm font-medium">{goal.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-white/10 text-black font-semibold rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-black font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : step === 1 ? 'Next' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};