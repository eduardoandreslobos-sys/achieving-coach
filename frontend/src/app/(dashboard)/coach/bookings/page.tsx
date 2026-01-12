'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import {
  Calendar,
  Clock,
  User,
  Mail,
  MessageSquare,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  duration: number;
  sessionTitle: string;
  meetingLink?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  createdAt?: Date;
  calendarEventId?: string;
}

interface BookingSettings {
  googleCalendar?: {
    connected: boolean;
    tokens?: {
      access_token: string;
      refresh_token?: string;
    };
    syncEnabled: boolean;
  };
  timezone?: string;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: AlertCircle,
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
  },
  completed: {
    label: 'Completada',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: CheckCircle,
  },
  no_show: {
    label: 'No Asistió',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: XCircle,
  },
};

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
    loadBookingSettings();
  }, [user]);

  const loadBookingSettings = async () => {
    if (!user) return;
    try {
      const settingsDoc = await getDoc(doc(db, 'booking_settings', user.uid));
      if (settingsDoc.exists()) {
        setBookingSettings(settingsDoc.data() as BookingSettings);
      }
    } catch (error) {
      console.error('Error loading booking settings:', error);
    }
  };

  const loadBookings = async () => {
    if (!user) return;

    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('coachId', '==', user.uid)
      );

      const snapshot = await getDocs(bookingsQuery);
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Booking[];

      // Sort by date (newest first)
      bookingsData.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });

      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const createCalendarEvent = async (booking: Booking): Promise<string | null> => {
    if (!bookingSettings?.googleCalendar?.connected || !bookingSettings?.googleCalendar?.syncEnabled) {
      return null;
    }

    const tokens = bookingSettings.googleCalendar.tokens;
    if (!tokens?.access_token) return null;

    try {
      // Calculate start and end times
      const startDateTime = new Date(`${booking.date}T${booking.time}`);
      const endDateTime = new Date(startDateTime.getTime() + booking.duration * 60 * 1000);

      const response = await fetch('/api/google/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          summary: `${booking.sessionTitle} - ${booking.clientName}`,
          description: `Sesión de coaching con ${booking.clientName}\nEmail: ${booking.clientEmail}${booking.notes ? `\n\nNotas: ${booking.notes}` : ''}`,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          attendeeEmail: booking.clientEmail,
          attendeeName: booking.clientName,
          meetingLink: booking.meetingLink,
          timezone: bookingSettings.timezone || 'America/Santiago',
        }),
      });

      const data = await response.json();
      if (data.success && data.event?.id) {
        return data.event.id;
      }
    } catch (error) {
      console.error('Error creating calendar event:', error);
    }
    return null;
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      let calendarEventId: string | null = null;

      // If confirming, create a session and calendar event
      if (newStatus === 'confirmed' && booking) {
        // Create calendar event
        calendarEventId = await createCalendarEvent(booking);

        // Create session in database
        await addDoc(collection(db, 'sessions'), {
          coachId: user?.uid,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          title: booking.sessionTitle,
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          meetingLink: booking.meetingLink || '',
          status: 'scheduled',
          notes: booking.notes || '',
          bookingId: bookingId,
          calendarEventId: calendarEventId || null,
          createdAt: serverTimestamp(),
        });
      }

      // Update booking status
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
        calendarEventId: calendarEventId || null,
        updatedAt: serverTimestamp(),
      });

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: newStatus as Booking['status'], calendarEventId: calendarEventId || undefined } : b))
      );

      const message = newStatus === 'confirmed'
        ? calendarEventId
          ? 'Reserva confirmada y agregada al calendario'
          : 'Reserva confirmada'
        : newStatus === 'cancelled'
          ? 'Reserva cancelada'
          : 'Reserva actualizada';

      toast.success(message);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error al actualizar la reserva');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    total: bookings.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reservas</h1>
            <p className="text-gray-400">Gestiona las reservas de tus clientes</p>
          </div>
          <Link
            href="/coach/booking"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Configurar Disponibilidad
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-gray-400">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
                <p className="text-sm text-gray-400">Confirmadas</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Todas' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay reservas</h3>
            <p className="text-gray-400">
              {filterStatus !== 'all'
                ? 'No hay reservas con este estado.'
                : 'Aún no tienes reservas. Comparte tu link de booking para recibir reservas.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusConfig = STATUS_CONFIG[booking.status];
              const StatusIcon = statusConfig.icon;
              const isPast = new Date(`${booking.date}T${booking.time}`) < new Date();

              return (
                <div
                  key={booking.id}
                  className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.clientName.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-white font-semibold text-lg">{booking.clientName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {booking.clientEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            {formatTime(booking.time)} ({booking.duration} min)
                          </span>
                        </div>
                        {booking.notes && (
                          <div className="mt-3 p-3 bg-[#0a0a0a] rounded-lg">
                            <p className="text-sm text-gray-400">
                              <MessageSquare className="w-4 h-4 inline mr-1" />
                              {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>

                      {booking.status === 'pending' && !isPast && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancelar
                          </button>
                        </div>
                      )}

                      {booking.status === 'confirmed' && !isPast && booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          Unirse
                        </a>
                      )}

                      {booking.status === 'confirmed' && isPast && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Completada
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'no_show')}
                            disabled={updating === booking.id}
                            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            No Asistió
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
