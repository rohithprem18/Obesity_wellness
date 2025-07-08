import React, { useState } from 'react';
import { Plus, Target, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { User, WellnessGoal } from '../types';

interface GoalsPanelProps {
  user: User;
}

export const GoalsPanel: React.FC<GoalsPanelProps> = ({ user }) => {
  const [goals, setGoals] = useState<WellnessGoal[]>([
    {
      id: '1',
      userId: user.id,
      title: 'Lose 5kg',
      target: 5,
      current: 2,
      unit: 'kg',
      category: 'physical',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '2',
      userId: user.id,
      title: 'Improve mood score',
      target: 8,
      current: 6,
      unit: 'points',
      category: 'mental',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      completed: false
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    unit: '',
    category: 'physical' as 'physical' | 'mental' | 'nutrition',
    deadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: WellnessGoal = {
      id: Date.now().toString(),
      userId: user.id,
      title: formData.title,
      target: parseFloat(formData.target),
      current: 0,
      unit: formData.unit,
      category: formData.category,
      deadline: new Date(formData.deadline),
      completed: false
    };
    setGoals(prev => [...prev, newGoal]);
    setFormData({ title: '', target: '', unit: '', category: 'physical', deadline: '' });
    setShowForm(false);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: progress, completed: progress >= goal.target }
        : goal
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-blue-400 bg-blue-500/20';
      case 'mental': return 'text-purple-400 bg-purple-500/20';
      case 'nutrition': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return '🏃‍♂️';
      case 'mental': return '🧠';
      case 'nutrition': return '🥗';
      default: return '🎯';
    }
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <span className="text-gray-600 text-sm">Total Goals</span>
          </div>
          <div className="text-3xl font-bold text-black">{goals.length}</div>
          <div className="text-sm text-gray-600">Active goals</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-green-400" />
            <span className="text-gray-600 text-sm">Completed</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {goals.filter(g => g.completed).length}
          </div>
          <div className="text-sm text-gray-600">Goals achieved</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-gray-600 text-sm">Progress</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {goals.length > 0 ? Math.round((goals.reduce((sum, g) => sum + (g.current / g.target), 0) / goals.length) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Average progress</div>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-black font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-md w-full">
            <h3 className="text-xl font-bold text-black mb-6">Create New Goal</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Lose 5kg"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Target</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="5"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="kg"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="physical">Physical Health</option>
                  <option value="mental">Mental Health</option>
                  <option value="nutrition">Nutrition</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-black font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-black">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-black">
                  {goal.current}/{goal.target} {goal.unit}
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{goal.deadline.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    goal.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                />
              </div>

              {/* Progress Update */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-600 text-sm mb-1">Update Progress</label>
                  <input
                    type="number"
                    value={goal.current}
                    onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value) || 0)}
                    max={goal.target}
                    min={0}
                    step="0.1"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>

              {goal.completed && (
                <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-300">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Goal Achieved! 🎉</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p>Create your first wellness goal to start tracking your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};