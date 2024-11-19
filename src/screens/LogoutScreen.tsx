import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LogoutScreen = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/auth');
  }, [logout, navigate]);

  return <div>Αντίο</div>;
};

export default LogoutScreen;
