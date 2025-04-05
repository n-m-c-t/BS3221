// protectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, hasRole } = useAuth();

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not authorized — redirect to unauthorized page
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorised" replace />;
  }

  // User is authenticated and authorized — allow route access
  return <Outlet />;
};

export default ProtectedRoute;
