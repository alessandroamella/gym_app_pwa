import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { FC, PropsWithChildren } from 'react';

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuthStore();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
