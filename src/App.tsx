import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import Chatbot from './components/Chatbot';

function App() {
  const { user: authUser, isLoading, login, register, logout } = useAuth();
  const [user, setUser] = useState(authUser);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Sync user state with authUser
  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  // Update user and persist to localStorage
  const handleUpdateUser = (updates: Partial<typeof user>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 3D animated background shapes
  const AnimatedShapes = () => (
    <div className="animated-shapes">
      <div className="animated-shape shape1" />
      <div className="animated-shape shape2" />
      <div className="animated-shape shape3" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AnimatedShapes />
        <div className="glass-3d p-10 w-full max-w-md mx-auto text-center animate-fade-in">
          <div className="text-gray-900 text-xl font-semibold">Loading...</div>
        </div>
        <Chatbot />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative min-h-screen">
        <AnimatedShapes />
        <div className="glass-3d max-w-7xl mx-auto my-8 p-4 md:p-8 animate-fade-in">
          <Dashboard user={user} onLogout={logout} onUpdateUser={handleUpdateUser} />
        </div>
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedShapes />
      <div className="w-full max-w-6xl mx-auto glass-3d p-8 md:p-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Hero Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 gradient-text" style={{ fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
              Wellness
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed" style={{ color: '#222', fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif' }}>
              Your intelligent companion for obesity prevention and mental wellness. 
              Get personalized predictions, track your progress, and transform your health journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2" style={{ color: '#444' }}>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>AI-Powered Predictions</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: '#444' }}>
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Mental Health Tracking</span>
              </div>
              <div className="flex items-center space-x-2" style={{ color: '#444' }}>
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>Personalized Recommendations</span>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="w-full">
            {isLoginMode ? (
              <LoginForm
                onSubmit={login}
                onToggleForm={() => setIsLoginMode(false)}
                isLoading={isLoading}
              />
            ) : (
              <RegisterForm
                onSubmit={register}
                onToggleForm={() => setIsLoginMode(true)}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;