'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation
} from '../../store/query/AuthApi';
import { format } from 'date-fns';
import Image from 'next/image';
import { Search, Users, UserCheck, UserMinus, Shield, Download, Plus, Edit, Trash, Ban } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  avatar: string;
  avatarFile: File | null;
}

function UserManagementPage() {
  const router = useRouter();
  
  // RTK Query hooks
  const { data: usersData = [], isLoading, error, refetch } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [changeStatus] = useChangeUserStatusMutation();

  // Filter states
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'staff' | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all'>('all');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  
  // Selected user states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  
  // Form states
  const [addUserData, setAddUserData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
    avatar: '',
    avatarFile: null
  });
  
  const [editUserData, setEditUserData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
    avatar: '',
    avatarFile: null
  });

  // Filter users based on selected filters
  const filteredUsers = usersData.filter((user: any) =>
    (selectedRole === 'all' || user.role === selectedRole) &&
    (selectedStatus === 'all' || user.status === selectedStatus)
  );

  // Statistics
  const stats = [
    { label: 'Total Users', value: usersData.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Users', value: usersData.filter((u: any) => u.status === 'active').length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Inactive Users', value: usersData.filter((u: any) => u.status === 'inactive').length, icon: UserMinus, color: 'bg-yellow-500' },
    { label: 'Admin Users', value: usersData.filter((u: any) => u.role === 'admin').length, icon: Shield, color: 'bg-purple-500' },
  ];

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', addUserData.name);
      formData.append('email', addUserData.email);
      formData.append('role', addUserData.role);
      formData.append('status', addUserData.status);
      formData.append('password', generateRandomPassword());
      
      if (addUserData.avatarFile) {
        formData.append('avatar', addUserData.avatarFile);
      }

      await addUser(formData).unwrap();
      
      setIsAddModalOpen(false);
      setAddUserData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active',
        avatar: '',
        avatarFile: null
      });
      refetch();
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  // Handle edit user
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || '',
      avatarFile: null
    });
    setIsQuickEditOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const formData = new FormData();
      formData.append('name', editUserData.name);
      formData.append('email', editUserData.email);
      formData.append('role', editUserData.role);
      formData.append('status', editUserData.status);
      
      if (editUserData.avatarFile) {
        formData.append('avatar', editUserData.avatarFile);
      }

      await updateUser({ id: selectedUser.id, formData }).unwrap();
      
      setIsQuickEditOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await deleteUser(deleteUserId).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteUserId(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Handle status change
  const handleStatusChange = async (userId: string, status: 'active' | 'inactive') => {
    try {
      await changeStatus({ id: userId, status }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to change user status:', error);
    }
  };

  // Handle file upload for avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (isEdit) {
          setEditUserData(prev => ({
            ...prev,
            avatar: event.target?.result as string,
            avatarFile: file
          }));
        } else {
          setAddUserData(prev => ({
            ...prev,
            avatar: event.target?.result as string,
            avatarFile: file
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar activePath="/user" />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-20 p-4 sm:p-8">
        {/* Header and Statistics sections remain the same as before */}
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
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
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image 
                        className="h-10 w-10 rounded-full" 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name}
                        width={40} 
                        height={40} 
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.lastLogin), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          setDeleteUserId(user.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsAddModalOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold mb-4">Add User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={addUserData.name}
                    onChange={e => setAddUserData({...addUserData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={addUserData.email}
                    onChange={e => setAddUserData({...addUserData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={addUserData.role}
                    onChange={e => setAddUserData({...addUserData, role: e.target.value as any})}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={addUserData.status}
                    onChange={e => setAddUserData({...addUserData, status: e.target.value as any})}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    onChange={(e) => handleAvatarChange(e)}
                  />
                  {addUserData.avatar && (
                    <div className="mt-2">
                      <Image 
                        src={addUserData.avatar} 
                        alt="Preview" 
                        width={80} 
                        height={80} 
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">Delete User</h2>
              <p className="mb-6 text-center text-gray-700">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Edit Panel */}
        {isQuickEditOpen && selectedUser && (
          <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsQuickEditOpen(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsQuickEditOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Photo</label>
                          <div className="mt-1 flex items-center">
                            <Image
                              src={editUserData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editUserData.name)}`}
                              alt=""
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              className="ml-5 hidden"
                              id="edit-avatar-upload"
                              onChange={(e) => handleAvatarChange(e, true)}
                            />
                            <label
                              htmlFor="edit-avatar-upload"
                              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            >
                              Change
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.name}
                            onChange={e => setEditUserData({...editUserData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.email}
                            onChange={e => setEditUserData({...editUserData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role</label>
                          <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.role}
                            onChange={e => setEditUserData({...editUserData, role: e.target.value as any})}
                          >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.status}
                            onChange={e => setEditUserData({...editUserData, status: e.target.value as any})}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setIsQuickEditOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleUpdateUser}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;