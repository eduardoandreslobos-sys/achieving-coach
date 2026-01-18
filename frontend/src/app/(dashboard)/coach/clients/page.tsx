'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Mail, Calendar, Plus, CheckCircle, Clock, MoreHorizontal, Search, Home, ChevronRight, ArrowRight } from 'lucide-react';

interface Client {
  uid: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt: any;
  organization?: string;
  photoURL?: string;
  status?: 'active' | 'pending';
}

export default function CoachClientsPage() {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      if (!userProfile?.uid) return;

      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid)
        );
        
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          status: doc.data().status || 'active'
        })) as Client[];
        
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [userProfile]);

  const filteredClients = clients.filter(client => {
    const name = client.displayName || `${client.firstName || ''} ${client.lastName || ''}`;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

  const getInitials = (client: Client) => {
    if (client.firstName && client.lastName) {
      return `${client.firstName[0]}${client.lastName[0]}`;
    }
    if (client.displayName) {
      const parts = client.displayName.split(' ');
      return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
    }
    return 'C';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/coach" className="text-gray-500 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-500">Coach</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="bg-[#1a1a1a] px-2 py-1 rounded text-white">Mis Clientes</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mis Clientes</h1>
              <p className="text-gray-400">Gestiona tus relaciones de coaching y seguimiento.</p>
            </div>
            <Link
              href="/coach/invite"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Invitar Cliente
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Activos</p>
                  <p className="text-3xl font-bold text-white">{activeClients || clients.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Pendientes</p>
                  <p className="text-3xl font-bold text-white">{pendingClients}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Total Clientes</p>
                  <p className="text-3xl font-bold text-white">{clients.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clients Grid */}
          {filteredClients.length === 0 && !searchQuery ? (
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
              <Users className="mx-auto text-gray-600 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">No tienes clientes aún</h2>
              <p className="text-gray-400 mb-6">Comienza a construir tu práctica de coaching invitando a tu primer cliente</p>
              <Link
                href="/coach/invite"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Invitar Primer Cliente
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client.uid}
                  className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {client.photoURL ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-700">
                          <Image
                            src={client.photoURL}
                            alt={client.displayName || 'Client'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-gray-700">
                          {getInitials(client)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white">
                          {client.displayName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Cliente'}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${client.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                          <span className="text-xs text-gray-500">
                            {client.status === 'pending' ? 'Pendiente' : 'Activo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Desde {client.createdAt?.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) || 'Recientemente'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/coach/clients/${client.uid}`}
                    className="flex items-center justify-end gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                  >
                    Ver Detalles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}

              {/* Invite New Client Card */}
              <Link
                href="/coach/invite"
                className="bg-[#111111] border border-dashed border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-gray-600 hover:bg-[#151515] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-3 group-hover:bg-[#222] transition-colors">
                  <Plus className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-medium mb-1">Invitar Nuevo Cliente</p>
                <p className="text-gray-500 text-sm text-center">Envía una invitación por correo</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
