import React from 'react';
import { User, LogOut, Bell, Pencil } from 'lucide-react';
import { User as UserType } from '../types';

interface DashboardHeaderProps {
  user: UserType;
  onLogout: () => void;
  onEditProfile?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout, onEditProfile }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <h1 className="text-2xl font-bold text-black flex items-center">
                  {greeting}, {user.name}!
                  <button className="ml-2 p-1 rounded hover:bg-gray-200" aria-label="Edit Profile" onClick={onEditProfile}>
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                </h1>
                <p className="text-gray-600">Ready to continue your wellness journey?</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-black">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};