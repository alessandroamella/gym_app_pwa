import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

export const ProtectedRoute: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const auth = useAuthStore();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
