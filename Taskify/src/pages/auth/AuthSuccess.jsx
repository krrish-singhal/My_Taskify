import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Get token from URL query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Check auth status to update user context
        await checkAuthStatus();
        
        // Redirect to dashboard
        navigate('/');
      } else {
        // If no token, redirect to login
        navigate('/login');
      }
    };

    handleAuthSuccess();
  }, [navigate, checkAuthStatus]);

  return <LoadingScreen />;
};

export default AuthSuccess;
