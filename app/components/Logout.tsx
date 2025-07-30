"use client";
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';

import { useLogoutMutation } from '../../store/query/AuthApi';
import { toast } from 'react-toastify';

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    
    setIsLoading(true);
    try {
      await logoutApi().unwrap();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
  
      router.push('/login');
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
      title="Logout"
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