import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const PrivateRoute: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Optional: Return a loading spinner or placeholder
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};