'use client';

import { useState } from 'react';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Session } from '@/types/coaching';

interface SessionConfirmationBannerProps {
  session: Session;
  onConfirm: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onRequestReschedule: () => void;
}

export default function SessionConfirmationBanner({
  session,
  onConfirm,
  onReject,
  onRequestReschedule,
}: SessionConfirmationBannerProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  if (session.status !== 'pending_confirmation') {
    return null;
  }

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setRejecting(true);
    try {
      await onReject(rejectReason);
      setShowRejectModal(false);
    } finally {
      setRejecting(false);
    }
  };

  const scheduledDate = session.scheduledDate?.toDate?.() || new Date(session.scheduledDate as unknown as string);

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Confirmación Requerida
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Tu coach ha programado esta sesión para el{' '}
              <span className="font-medium">
                {scheduledDate.toLocaleDateString('es-CL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              a las{' '}
              <span className="font-medium">{session.scheduledTime}</span>.
              Por favor confirma tu asistencia.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {confirming ? 'Confirmando...' : 'Confirmar Asistencia'}
              </button>
              <button
                onClick={onRequestReschedule}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Proponer otro horario
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Rechazar Sesión
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Por favor indica la razón por la que no puedes asistir a esta sesión.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Escribe la razón aquí..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {rejecting ? 'Rechazando...' : 'Rechazar Sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
