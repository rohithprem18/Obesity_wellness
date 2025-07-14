import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        age: 30,
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        healthGoals: ['lose-weight', 'improve-mood'],
        createdAt: new Date()
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userData.email && userData.password) {
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        age: userData.age || 25,
        height: userData.height || 170,
        weight: userData.weight || 70,
        activityLevel: userData.activityLevel || 'moderate',
        healthGoals: userData.healthGoals || [],
        createdAt: new Date()
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, isLoading, login, register, logout };
};