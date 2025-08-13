import Image from 'next/image';
import { Ban, Trash } from 'lucide-react';
import { User } from '../usercomponents/types';

interface UserRowProps {
  user: User;
  onStatusChange: (userId: string, status: 'active' | 'inactive') => void;
  onDeleteClick: (userId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export  function UserRow({ user, onStatusChange, onDeleteClick, isUpdating, isDeleting }: UserRowProps) {
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'US';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.avatar ? (
            <Image 
              className="h-10 w-10 rounded-full" 
              src={user.avatar.startsWith('http') ? user.avatar : `https://res.cloudinary.com/your-cloud-name/image/upload/w_48,q_75/${user.avatar}`}
              alt={user.name || 'User avatar'}
              width={40}
              height={40}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">{initials}</span>
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-500">
              {user.email || 'No email provided'}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.role || 'N/A'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {user.status || 'N/A'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.lastLogin 
          ? new Date(user.lastLogin).toLocaleString() 
          : 'Never logged in'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-3">
          <button 
            className="text-yellow-600 hover:text-yellow-900"
            onClick={() => onStatusChange(
              user.id || '', 
              user.status === 'active' ? 'inactive' : 'active'
            )}
            aria-label={`Toggle status for ${user.name || 'user'}`}
            disabled={!user.id || isUpdating}
          >
            <Ban className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => user.id && onDeleteClick(user.id)}
            aria-label={`Delete ${user.name || 'user'}`}
            disabled={!user.id || isDeleting}
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}