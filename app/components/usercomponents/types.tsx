export type Role = 'admin' | 'manager' | 'staff';
export type Status = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  avatar?: string;
  lastLogin?: string;
}