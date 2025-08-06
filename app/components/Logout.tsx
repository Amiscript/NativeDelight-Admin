"use client";
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../store/slices/authSlice';

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // if (!confirm('Are you sure you want to logout?')) return;
    
    setIsLoading(true);
    try {
      dispatch(logout()); // Clear auth state
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      // Force clear auth state even if something fails
      dispatch(logout());
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