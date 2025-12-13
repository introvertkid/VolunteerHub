import { RoleID } from '@/types/user';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user } = useAuth();

  const roleId = (user?.role?.id) || null;

  const isAccepted = (role: RoleID) => roleId == role;
  const isAdmin = roleId === RoleID.ADMIN;
  const isManager = roleId === RoleID.MANAGER;
  const isVolunteer = roleId === RoleID.VOLUNTEER;

  return {
    roleId,
    loading: false,
    isAccepted,
    isAdmin,
    isManager,
    isVolunteer
  };
};