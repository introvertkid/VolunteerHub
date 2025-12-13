export enum RoleID {
  VOLUNTEER = 1,
  MANAGER = 2,
  ADMIN = 3
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}