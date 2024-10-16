// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
  loginComponent: JSX.Element; // Add loginComponent prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, loginComponent }) => {
  const token = localStorage.getItem('token');

  return token ? element : loginComponent; // Render loginComponent if not authenticated
};

export default ProtectedRoute;
