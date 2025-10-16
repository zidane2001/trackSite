import React, { useEffect, useState } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon, UserIcon } from 'lucide-react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { usersApi, User } from '../../utils/api';
export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to localStorage
      const fallback = loadFromStorage<User[]>(STORAGE_KEYS.users, []);
      setUsers(fallback);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = async (id: number) => {
    try {
      await usersApi.delete(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      // Fallback to local storage
      const updated = users.filter(user => user.id !== id);
      setUsers(updated);
      saveToStorage(STORAGE_KEYS.users, updated);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'agent',
    branch: '',
    status: 'active',
    created_at: ''
  });

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const created = await usersApi.create(newUser);
        setUsers([...users, created]);
        setNewUser({
          name: '',
          email: '',
          role: 'agent',
          branch: '',
          status: 'active',
          created_at: ''
        });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Failed to create user:', error);
        // Fallback to local storage
        const newUserWithId = {
          ...newUser,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        setUsers([...users, newUserWithId as User]);
        saveToStorage(STORAGE_KEYS.users, [...users, newUserWithId as User]);
      }
    }
  };

  const handleEditUser = async () => {
    if (editingUser && editingUser.name && editingUser.email) {
      try {
        await usersApi.update(editingUser.id, {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          branch: editingUser.branch,
          status: editingUser.status
        });
        setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
        setIsEditModalOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Failed to update user:', error);
        // Fallback to local storage
        const updated = users.map(user => user.id === editingUser.id ? editingUser : user);
        setUsers(updated);
        saveToStorage(STORAGE_KEYS.users, updated);
      }
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'agent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage users and their access permissions
          </p>
          {loading && <p className="text-sm text-blue-600 mt-1">Loading...</p>}
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon size={18} className="mr-2" />
          Add User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">Role:</label>
                <select className="p-2 border rounded-lg" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-sm text-gray-600">Status:</label>
                <select className="p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 border-b font-medium">User</th>
                <th className="px-6 py-3 border-b font-medium">Role</th>
                <th className="px-6 py-3 border-b font-medium">Branch</th>
                <th className="px-6 py-3 border-b font-medium">Status</th>
                <th className="px-6 py-3 border-b font-medium">Last Login</th>
                <th className="px-6 py-3 border-b font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <UserIcon size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">{user.branch}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">{user.last_login || 'Never'}</td>
                  <td className="px-6 py-4 border-b text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-1" title="Edit" onClick={() => openEditModal(user)}>
                      <PencilIcon size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-1 ml-2" title="Delete" onClick={() => handleDeleteUser(user.id)}>
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>)}
              {filteredUsers.length === 0 && <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex">
            <button className="px-3 py-1 border rounded mr-2 text-gray-600 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. john.doe@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'manager' | 'agent' })}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Paris HQ"
                  value={newUser.branch}
                  onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'manager' | 'agent' })}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={editingUser.branch}
                  onChange={(e) => setEditingUser({ ...editingUser, branch: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleEditUser}
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>;
};