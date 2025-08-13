'use client';
import React, { useState } from 'react';
import { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../store/query/AuthApi';
// import { format } from 'date-fns';
import Image from 'next/image';
import { Users, UserCheck, UserMinus, Plus,Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApiError } from '../../store/query/AuthApi';
import DeleteUserModal from '../components/usercomponents/DeleteUserModal';
import UserTable from '../components/usercomponents/UserTable';



type Role =   'admin'| 'manager' | 'staff';
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
  const { data: apiResponse, isLoading, refetch } = useGetUsersQuery({
  page: 1, 
  limit: 10
});

  const users: User[] = apiResponse?.data || apiResponse?.users || [];

  console.log(users)
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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
    const formData = new FormData();
    formData.append('name', addUserData.name);
    formData.append('email', addUserData.email);
    formData.append('role', addUserData.role);
    formData.append('status', addUserData.status);
    
    if (addUserData.avatarFile) {
      formData.append('avatar', addUserData.avatarFile);
    }

    await toast.promise(
      addUser(formData).unwrap(),
      {
        pending: 'Creating user account...',
        success: {
          render({ data }) {
            setIsAddModalOpen(false);
            return data?.message || 'User added successfully';
          }
        },
        error: {
          render({ data }) {
            if (isApiError(data)) {
              if (data.status === 409) return 'Email already exists';
              if (data.status === 413) return 'Image is too large (max 2MB)';
              if (data.data?.errors?.email) return data.data.errors.email[0];
              if (data.data?.errors?.name) return data.data.errors.name[0];
              return data.data?.message || 'Failed to add user';
            }
            return 'Network error. Please try again.';
          }
        }
      }
    );

    // Reset form
    setAddUserData({
      name: '',
      email: '',
      role: 'staff',
      status: 'active',
      avatar: '',
      avatarFile: null
    });
    
    await refetch();

  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) {
        toast.error('Unauthorized: Please login again');
      } else if (error.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          toast.error(`${field}: ${(messages as string[]).join(', ')}`);
        });
      } else {
        toast.error(error.data?.message || 'Failed to process request');
      }
    } else {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  }
};
function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'data' in error;
}
const handleUpdateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedUser) return;
  
  try {
    const response = await updateUser({
      id: selectedUser.id,
      data: {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role,
        status: editUserData.status,
        avatarFile: editUserData.avatarFile || undefined
      }
    }).unwrap();

    toast.success(response.message || 'User updated successfully');
    setIsQuickEditOpen(false);
    setSelectedUser(null);
    refetch();
  } catch (error) {
    if (isApiError(error)) {
      toast.error(error.data?.message || 'Failed to update user');
    }
  } 
};

  const handleDeleteUser = async () => {
  if (!deleteUserId) return;
  
  try {
    console.log("Attempting to delete user with ID:", deleteUserId); // Add this
    const response = await deleteUser(deleteUserId).unwrap();
    console.log("Delete response:", response); // Add this
    toast.success(response.message || 'User deleted successfully');
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
    refetch();
  } catch (error) {
    console.error("Delete error:", error); // Add this
    if (isApiError(error)) {
      toast.error(error.data?.message || 'Failed to delete user');
    } else {
      toast.error('An unexpected error occurred');
    }
  }
};

  const handleStatusChange = async (userId: string, status: Status) => {
    try {
      const response = await updateUser({
        id: userId,
        data: { status }
      }).unwrap();
      toast.success(response.message || 'Status updated successfully');
      refetch();
    } catch (error) {
      if (isApiError(error)) {
      toast.error(error.data?.message || 'Failed to change user status');
    }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  // Validate file type
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a JPG, PNG, or WEBP image');
    return;
  }

  // Validate file size
  if (file.size > maxSize) {
    toast.error('Image size must be less than 2MB');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (event) => {
    const updateState = isEdit ? setEditUserData : setAddUserData;
    updateState(prev => ({
      ...prev,
      avatar: event.target?.result as string,
      avatarFile: file // Store the actual File object for upload
    }));
  };

  reader.onerror = () => {
    toast.error('Error reading image file');
  };

  reader.readAsDataURL(file);
};
 

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  // if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading users</div>
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
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                onClick={() => setIsAddModalOpen(true)}
                disabled={isAdding}
              >
                {isAdding ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
              <UserTable
        users={filteredUsers}
        onStatusChange={handleStatusChange}
        onDeleteClick={(userId) => {
          setDeleteUserId(userId);
          setIsDeleteModalOpen(true);
        }}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
        {/* < */}

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isAdding}
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
                  <label className="block text-sm font-medium text-gray-700">Avatar (Optional)</label>
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
                    disabled={isAdding}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-blue-400"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
          <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          isLoading={isDeleting}
        />
       
        {/* Quick Edit Panel */}
        {isQuickEditOpen && selectedUser && (
          <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => !isUpdating && setIsQuickEditOpen(false)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => !isUpdating && setIsQuickEditOpen(false)}
                        disabled={isUpdating}
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
                              disabled={isUpdating}
                            />
                            <label
                              htmlFor="edit-avatar-upload"
                              className={`ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                            disabled={isUpdating}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.email}
                            onChange={e => setEditUserData({...editUserData, email: e.target.value})}
                            disabled={isUpdating}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role</label>
                          <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={editUserData.role}
                            onChange={e => setEditUserData({...editUserData, role: e.target.value as Role})}
                            disabled={isUpdating}
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
                            disabled={isUpdating}
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
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      onClick={() => setIsQuickEditOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                      onClick={handleUpdateUser}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
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