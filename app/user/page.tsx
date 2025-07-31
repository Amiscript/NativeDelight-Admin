'use client';
import React, { useState } from 'react';
import { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../store/query/AuthApi';
import { format } from 'date-fns';
import Image from 'next/image';
import { Users, UserCheck, UserMinus, Shield, Download, Plus, Edit, Trash, Ban } from 'lucide-react';
import Sidebar from '../components/Sidebar';

type Role = 'admin' | 'manager' | 'staff';
type Status = 'active' | 'inactive';


interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  avatar?: string;
  lastLogin?: string;
}

function UserManagementPage() {
  // Data fetching
  const { data: apiResponse, isLoading, error } = useGetUsersQuery();
const users: User[] = apiResponse?.data || apiResponse?.users || [];
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  

  const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Form states
  const [addUserData, setAddUserData] = useState({
    name: '',
    email: '',
    role: 'staff' as Role,
    status: 'active' as Status,
    avatar: '',
    avatarFile: null as File | null
  });

  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: 'staff' as Role,
    status: 'active' as Status,
    avatar: '',
    avatarFile: null as File | null
  });

  // Filter users
  const filteredUsers = users.filter(user =>
    (selectedRole === 'all' || user.role === selectedRole) &&
    (selectedStatus === 'all' || user.status === selectedStatus)
  );

  // Statistics
  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Inactive Users', value: users.filter(u => u.status === 'inactive').length, icon: UserMinus, color: 'bg-yellow-500' },
    { label: 'Admin Users', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'bg-purple-500' },
  ];

  // Handlers
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser({
        name: addUserData.name,
        email: addUserData.email,
        role: addUserData.role,
        status: addUserData.status,
        avatarFile: addUserData.avatarFile || undefined,
        password: generateRandomPassword()
      }).unwrap();
      
      setIsAddModalOpen(false);
      setAddUserData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active',
        avatar: '',
        avatarFile: null
      });
    } catch (error) {
      console.log('Failed to add user:', error);
    }
  };

  const handleEditUser = (user: User) => {
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
      await updateUser({
        id: selectedUser.id,
        data: {
          name: editUserData.name,
          email: editUserData.email,
          role: editUserData.role,
          status: editUserData.status,
          avatarFile: editUserData.avatarFile || undefined
        }
      }).unwrap();
      
      setIsQuickEditOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await deleteUser(deleteUserId).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteUserId(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleStatusChange = async (userId: string, status: Status) => {
    try {
      await updateUser({
        id: userId,
        data: { status }
      }).unwrap();
    } catch (error) {
      console.error('Failed to change user status:', error);
    }
  };

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

  const generateRandomPassword = () => Math.random().toString(36).slice(-8);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading users</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar activePath="/user" />
      
      {/* Main Content */}
      <div className="flex-1 md:ml-20 p-4 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users in your organization</p>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role | 'all')}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
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
  {filteredUsers.map((user, index) => {

    // Create a guaranteed unique key
    const uniqueKey = user.id 
      ? `user-${user.id}`
      : `user-${user.email}-${index}`; // Fallback using email + index
    
    // Generate initials for avatar fallback
    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'US'; // Default initials

    return (
      <tr key={uniqueKey} className="hover:bg-gray-50">
        {/* Avatar and Name Cell */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {user.avatar ? (
              <Image 
                className="h-10 w-10 rounded-full" 
                src={user.avatar}
                alt={user.name || 'User avatar'}
                width={40}
                height={40}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {initials}
                </span>
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

        {/* Role Cell */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {user.role || 'N/A'}
          </span>
        </td>

        {/* Status Cell */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.status === 'active' ? 'bg-green-100 text-green-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {user.status || 'N/A'}
          </span>
        </td>

        {/* Last Login Cell */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.lastLogin 
            ? format(new Date(user.lastLogin), 'MMM d, yyyy HH:mm') 
            : 'Never logged in'}
        </td>

        {/* Actions Cell */}
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => handleEditUser(user)}
              className="text-blue-600 hover:text-blue-900"
              aria-label={`Edit ${user.name || 'user'}`}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              className="text-yellow-600 hover:text-yellow-900"
              onClick={() => handleStatusChange(
                user.id || '', 
                user.status === 'active' ? 'inactive' : 'active'
              )}
              aria-label={`Toggle status for ${user.name || 'user'}`}
              disabled={!user.id}
            >
              <Ban className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => {
                if (user.id) {
                  setDeleteUserId(user.id);
                  setIsDeleteModalOpen(true);
                }
              }}
              aria-label={`Delete ${user.name || 'user'}`}
              disabled={!user.id}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  })}
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
                    onChange={e => setAddUserData({...addUserData, role: e.target.value as Role})}
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
                    onChange={e => setAddUserData({...addUserData, status: e.target.value as Status})}
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
                  >
                    Add User
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
                >
                  Delete
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
                            onChange={e => setEditUserData({...editUserData, role: e.target.value as Role})}
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
                            onChange={e => setEditUserData({...editUserData, status: e.target.value as Status})}
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
                    >
                      Save Changes
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