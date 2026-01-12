'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import {
  Calendar,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface GoogleCalendarTokens {
  access_token: string;
  refresh_token?: string;
}

interface BookingSettings {
  enabled: boolean;
  title: string;
  description: string;
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  minNotice: number;
  maxAdvance: number;
  timezone: string;
  meetingLink: string;
  coachName: string;
  coachEmail: string;
  googleCalendar?: {
    connected: boolean;
    tokens?: GoogleCalendarTokens;
    checkBusyTimes: boolean;
  };
  availability: {
    [key: string]: DayAvailability;
  };
}

interface BusyTime {
  start: string;
  end: string;
}

interface CoachInfo {
  displayName: string;
  email: string;
  photoURL?: string;
  coachProfile?: {
    bio?: string;
    specialties?: string[];
  };
}

interface ExistingBooking {
  date: string;
  time: string;
}

const DAYS_MAP: { [key: number]: string } = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PublicBookingPage() {
  const params = useParams();
  const router = useRouter();
  const coachId = params?.coachId as string;

  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [coachInfo, setCoachInfo] = useState<CoachInfo | null>(null);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [busyTimes, setBusyTimes] = useState<BusyTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    loadBookingData();
  }, [coachId]);

  const loadBusyTimes = async (settingsData: BookingSettings) => {
    if (!settingsData.googleCalendar?.connected ||
        !settingsData.googleCalendar?.checkBusyTimes ||
        !settingsData.googleCalendar?.tokens?.access_token) {
      return [];
    }

    try {
      const now = new Date();
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + (settingsData.maxAdvance || 30));

      const response = await fetch(
        `/api/google/busy?accessToken=${encodeURIComponent(settingsData.googleCalendar.tokens.access_token)}` +
        `&refreshToken=${encodeURIComponent(settingsData.googleCalendar.tokens.refresh_token || '')}` +
        `&timeMin=${now.toISOString()}` +
        `&timeMax=${maxDate.toISOString()}` +
        `&timezone=${encodeURIComponent(settingsData.timezone || 'America/Santiago')}`
      );

      const data = await response.json();
      if (data.success && data.busyTimes) {
        return data.busyTimes as BusyTime[];
      }
    } catch (error) {
      console.error('Error loading busy times:', error);
    }
    return [];
  };

  const loadBookingData = async () => {
    try {
      // Load booking settings
      const settingsDoc = await getDoc(doc(db, 'booking_settings', coachId));
      if (!settingsDoc.exists()) {
        setError('Este coach no tiene habilitadas las reservas públicas.');
        setLoading(false);
        return;
      }

      const settingsData = settingsDoc.data() as BookingSettings;
      if (!settingsData.enabled) {
        setError('Las reservas para este coach están temporalmente deshabilitadas.');
        setLoading(false);
        return;
      }

      setSettings(settingsData);

      // Load coach info
      const coachDoc = await getDoc(doc(db, 'users', coachId));
      if (coachDoc.exists()) {
        setCoachInfo(coachDoc.data() as CoachInfo);
      }

      // Load existing bookings for the next 90 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 90);

      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('coachId', '==', coachId),
        where('status', 'in', ['pending', 'confirmed'])
      );

      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookings = bookingsSnapshot.docs.map(doc => ({
        date: doc.data().date,
        time: doc.data().time,
      }));

      setExistingBookings(bookings);

      // Load Google Calendar busy times
      const calendarBusyTimes = await loadBusyTimes(settingsData);
      setBusyTimes(calendarBusyTimes);
    } catch (err) {
      console.error('Error loading booking data:', err);
      setError('Error al cargar la información de reservas.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a time slot conflicts with busy times
  const isSlotBusy = (slotStart: Date, slotEnd: Date): boolean => {
    return busyTimes.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      // Check if there's any overlap
      return slotStart < busyEnd && slotEnd > busyStart;
    });
  };

  const generateTimeSlots = (date: Date): string[] => {
    if (!settings) return [];

    const dayKey = DAYS_MAP[date.getDay()];
    const dayAvailability = settings.availability[dayKey];

    if (!dayAvailability?.enabled || !dayAvailability.slots.length) {
      return [];
    }

    const slots: string[] = [];
    const now = new Date();
    const minNoticeTime = new Date(now.getTime() + settings.minNotice * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];

    dayAvailability.slots.forEach(slot => {
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);

      let currentTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      const duration = settings.duration + settings.bufferAfter;

      while (currentTime + settings.duration <= endTime) {
        const hour = Math.floor(currentTime / 60);
        const min = currentTime % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Check if this slot is in the past or within minimum notice
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hour, min, 0, 0);

        const slotEndDateTime = new Date(slotDateTime.getTime() + settings.duration * 60 * 1000);

        const isAvailable = slotDateTime > minNoticeTime;
        const isBooked = existingBookings.some(
          b => b.date === dateString && b.time === timeString
        );

        // Check Google Calendar busy times
        const isBusy = isSlotBusy(slotDateTime, slotEndDateTime);

        if (isAvailable && !isBooked && !isBusy) {
          slots.push(timeString);
        }

        currentTime += duration;
      }
    });

    return slots;
  };

  const isDateAvailable = (date: Date): boolean => {
    if (!settings) return false;

    const dayKey = DAYS_MAP[date.getDay()];
    const dayAvailability = settings.availability[dayKey];

    if (!dayAvailability?.enabled) return false;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + settings.maxAdvance);

    if (date < now || date > maxDate) return false;

    // Check if there are any available slots for this date
    const slots = generateTimeSlots(date);
    return slots.length > 0;
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add padding for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !settings) return;

    setSubmitting(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];

      // Create the booking
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        coachId,
        coachName: coachInfo?.displayName || settings.coachName,
        coachEmail: settings.coachEmail,
        clientName: formData.name,
        clientEmail: formData.email,
        notes: formData.notes,
        date: dateString,
        time: selectedTime,
        duration: settings.duration,
        meetingLink: settings.meetingLink,
        sessionTitle: settings.title,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Create notification for coach
      await addDoc(collection(db, 'notifications'), {
        userId: coachId,
        type: 'new_booking',
        title: 'Nueva Reserva',
        message: `${formData.name} ha reservado una sesión para el ${new Date(dateString).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las ${selectedTime}`,
        bookingId: bookingRef.id,
        read: false,
        createdAt: serverTimestamp(),
      });

      setStep('success');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Error al crear la reserva. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    const now = new Date();
    if (newMonth.getFullYear() > now.getFullYear() ||
        (newMonth.getFullYear() === now.getFullYear() && newMonth.getMonth() >= now.getMonth())) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + (settings?.maxAdvance || 30));
    if (newMonth <= maxDate) {
      setCurrentMonth(newMonth);
    }
  };

  const formatTime = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No Disponible</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reserva Confirmada</h1>
          <p className="text-gray-400 mb-6">
            Tu sesión ha sido reservada exitosamente. Recibirás un correo de confirmación con los detalles.
          </p>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-white">
                {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-white">{selectedTime && formatTime(selectedTime)} ({settings?.duration} min)</span>
            </div>
            {settings?.meetingLink && (
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-violet-400" />
                <a href={settings.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 truncate">
                  Link de Videollamada
                </a>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const availableSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-white text-xl">AchievingCoach</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coach Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 sticky top-8">
              {/* Coach Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                {coachInfo?.photoURL ? (
                  <img
                    src={coachInfo.photoURL}
                    alt={coachInfo.displayName}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {(coachInfo?.displayName || settings?.coachName || 'C').charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-xl font-bold text-white">
                  {coachInfo?.displayName || settings?.coachName}
                </h2>
                <p className="text-gray-400 text-sm">Coach Profesional</p>
              </div>

              {/* Session Info */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-white mb-2">{settings?.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{settings?.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>{settings?.duration} minutos</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Video className="w-5 h-5 text-emerald-400" />
                    <span>Videollamada</span>
                  </div>
                </div>
              </div>

              {/* Coach Bio */}
              {coachInfo?.coachProfile?.bio && (
                <div className="border-t border-gray-800 pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Sobre el Coach</h4>
                  <p className="text-gray-300 text-sm">{coachInfo.coachProfile.bio}</p>
                </div>
              )}

              {/* Specialties */}
              {coachInfo?.coachProfile?.specialties && coachInfo.coachProfile.specialties.length > 0 && (
                <div className="border-t border-gray-800 pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {coachInfo.coachProfile.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calendar & Time Selection */}
          <div className="lg:col-span-2">
            {step === 'calendar' && (
              <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Selecciona Fecha y Hora</h2>

                {/* Calendar */}
                <div className="mb-6">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-semibold text-white">
                      {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={index} className="p-3"></div>;
                      }

                      const isAvailable = isDateAvailable(date);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={index}
                          onClick={() => isAvailable && handleDateSelect(date)}
                          disabled={!isAvailable}
                          className={`
                            p-3 rounded-lg text-center transition-all
                            ${isSelected
                              ? 'bg-blue-600 text-white'
                              : isAvailable
                                ? 'text-white hover:bg-gray-800'
                                : 'text-gray-600 cursor-not-allowed'
                            }
                            ${isToday && !isSelected ? 'ring-1 ring-blue-500' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="border-t border-gray-800 pt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Horarios disponibles - {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h4>

                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`
                              py-3 px-4 rounded-lg border transition-all text-sm font-medium
                              ${selectedTime === time
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white'
                              }
                            `}
                          >
                            {formatTime(time)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-8">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 'form' && (
              <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
                <button
                  onClick={() => setStep('calendar')}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al calendario
                </button>

                <h2 className="text-xl font-semibold text-white mb-2">Completa tu Reserva</h2>
                <p className="text-gray-400 mb-6">
                  {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} a las {selectedTime && formatTime(selectedTime)}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Notas para el Coach (opcional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Cuéntale al coach sobre qué te gustaría hablar..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Reservando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirmar Reserva
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-xs">
                    Al reservar, aceptas que el coach pueda contactarte por correo electrónico.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Powered by <Link href="/" className="text-blue-400 hover:text-blue-300">AchievingCoach</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
