import React, { useState } from 'react';
import { User } from '../types';

interface ProfileEditProps {
  user: User;
  onSave: (updates: { height: number; weight: number }) => void;
  onCancel: () => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onSave, onCancel }) => {
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ height, weight });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={height}
          onChange={e => setHeight(Number(e.target.value))}
          min={50}
          max={250}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={weight}
          onChange={e => setWeight(Number(e.target.value))}
          min={20}
          max={300}
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600">Save</button>
      </div>
    </form>
  );
}; 