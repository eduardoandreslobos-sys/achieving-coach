'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  TrendingUp,
  BarChart3,
  Settings, 
  LogOut, 
  Bell,
  HelpCircle,
  Search
} from 'lucide-react';
import { doc, getDoc, collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notification {
  id: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, userProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    } else if (user) {
      checkRole();
      loadNotifications();
    }
  }, [user, loading]);

  const checkRole = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.data()?.role;
      setUserRole(role);
      if (role !== 'admin') {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking role:', error);
      router.push('/dashboard');
    } finally {
      setCheckingRole(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
      const snapshot = await getDocs(q);
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Notification[];
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') return null;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Gestión de Usuarios', href: '/admin/users', icon: Users },
    { name: 'Contenido', href: '/admin/blog', icon: FileText },
    { name: 'Análisis SEO', href: '/admin/seo', icon: TrendingUp },
    { name: 'Analíticas', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  const userName = userProfile?.displayName || userProfile?.firstName || 'Juan Pérez';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumb
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return null;
    const pageNames: Record<string, string> = {
      'admin': 'Administración',
      'users': 'Gestión de Usuarios',
      'blog': 'Contenido',
      'seo': 'Análisis SEO',
      'analytics': 'Analíticas',
      'settings': 'Configuración',
    };
    return pageNames[segments[1]] || segments[1];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0f1117] border-r border-gray-800/50 z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">AchievingCoach</div>
              <div className="text-xs text-gray-500">Admin Workspace</div>
            </div>
          </div>

          {/* User info card */}
          <div className="mx-3 mb-4">
            <div className="bg-[#1a1b23] rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">JP</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1b23]"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{userName}</div>
                  <div className="text-xs text-gray-500">Administrador</div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu label */}
          <div className="px-5 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">MENU PRINCIPAL</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="px-3 py-4 border-t border-gray-800/50 space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-xl transition-all"
            >
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <span className="text-sm">Ayuda y Soporte</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-sm border-b border-gray-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Admin Workspace</span>
              {breadcrumb && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-white font-medium">{breadcrumb}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-64 pl-10 pr-4 py-2 bg-[#12131a] border border-gray-800 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#12131a] rounded-xl shadow-xl border border-gray-800 py-2 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <h3 className="font-semibold text-white">Notificaciones</h3>
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-gray-800/50 border-b border-gray-800/50">
                          <p className="text-sm text-gray-300">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {n.createdAt?.toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">Sin notificaciones</p>
                    )}
                  </div>
                )}
              </div>

              {/* User avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">JP</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
