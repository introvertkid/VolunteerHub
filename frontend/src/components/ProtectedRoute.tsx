import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleID } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: RoleID;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isManager, isVolunteer, loading: roleLoading, isAccepted} = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && !isAccepted(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};