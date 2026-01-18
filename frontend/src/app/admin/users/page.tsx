'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, MoreHorizontal, UserPlus, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'coach' | 'coachee';
  status?: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  lastLoginAt?: Date;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data();
        const lastLogin = data.lastLoginAt?.toDate();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        let status: 'active' | 'inactive' | 'pending' = 'active';
        if (!data.emailVerified) status = 'pending';
        else if (lastLogin && lastLogin < thirtyDaysAgo) status = 'inactive';

        return {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || data.firstName || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          role: data.role || 'coachee',
          status,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: lastLogin,
        };
      }) as User[];
      
      usersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(term) ||
        u.displayName?.toLowerCase().includes(term) ||
        u.firstName?.toLowerCase().includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const getName = (user: User) => {
    if (user.displayName) return user.displayName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email.split('@')[0];
  };

  const getInitials = (user: User) => {
    const name = getName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-emerald-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'coach': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'coachee': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'admin': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Activo' };
      case 'inactive': return { dot: 'bg-gray-400', text: 'text-gray-400', label: 'Inactivo' };
      case 'pending': return { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Pendiente' };
      default: return { dot: 'bg-gray-400', text: 'text-gray-400', label: status };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      setOpenMenu(null);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
            <p className="text-gray-400 mt-1">Gestiona todos los usuarios, coaches y administradores de la plataforma.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <UserPlus className="w-4 h-4" />
            Añadir Usuario
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#12131a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-[#12131a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Rol: Todos</option>
                <option value="coach">Coach</option>
                <option value="coachee">Coachee</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-[#12131a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Estado: Todos</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Última Actividad</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => {
                const statusInfo = getStatusBadge(user.status || 'active');
                return (
                  <tr key={user.id} className="hover:bg-[#1a1b23] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(getName(user))}`}>
                          {getInitials(user)}
                        </div>
                        <span className="text-white font-medium">{getName(user)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
                        <span className={statusInfo.text}>{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                        {openMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-[#1a1b23] border border-gray-700 rounded-lg shadow-xl z-10">
                            <button
                              onClick={() => handleRoleChange(user.id, 'coach')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                            >
                              Cambiar a Coach
                            </button>
                            <button
                              onClick={() => handleRoleChange(user.id, 'coachee')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                            >
                              Cambiar a Coachee
                            </button>
                            <button
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                            >
                              Cambiar a Admin
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
