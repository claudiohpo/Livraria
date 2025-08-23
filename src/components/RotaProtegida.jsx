import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';

const RotaProtegida = ({ children, requiredUserType }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredUserType && user.tipoUsuario !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RotaProtegida;