"use client";
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import api from '@/services/api';

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    
    setIsLoading(true);
    try {
      // Clear token from backend if needed
      await api.post('/auth/logout');
      
      // Dispatch logout action to clear Redux state
      dispatch(logoutUser());
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-gray-400 hover:text-white focus:outline-none"
      aria-label="Logout"
    >
      {isLoading ? (
        <span className="animate-spin">↻</span>
      ) : (
        <LogOut className="h-5 w-5" />
      )}
    </button>
  );
};

export default Logout;