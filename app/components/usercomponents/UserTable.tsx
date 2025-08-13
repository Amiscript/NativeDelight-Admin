import { User } from '../usercomponents/types'
import {UserRow} from '../usercomponents/UserRow';

interface UserTableProps {
  users: User[];
  onStatusChange: (userId: string, status: 'active' | 'inactive') => void;
  onDeleteClick: (userId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export  default function UserTable({ 
  users, 
  onStatusChange, 
  onDeleteClick, 
  isUpdating, 
  isDeleting 
}: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow 
              key={user.id || user.email}
              user={user}
              onStatusChange={onStatusChange}
              onDeleteClick={onDeleteClick}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}