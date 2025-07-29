// hooks/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from './store/query/AuthApi';
import { setCredentials, logout, selectCurrentUser, selectCurrentToken } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginMutation] = useLoginMutation();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation({ email, password }).unwrap();
      dispatch(setCredentials({ token: response.token, user: response.user }));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    router.push('/login');
  };

  return { user, token, login, logout: logoutUser, isAuthenticated: !!token };
};