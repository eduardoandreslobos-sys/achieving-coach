'use client';

import { useState } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { RescheduleEntry } from '@/types/coaching';

interface RescheduleResponseBannerProps {
  rescheduleRequest: RescheduleEntry;
  onAccept: () => Promise<void>;
  onReject: (note: string) => Promise<void>;
  isRequester: boolean; // true if current user is the one who requested
}

export default function RescheduleResponseBanner({
  rescheduleRequest,
  onAccept,
  onReject,
  isRequester,
}: RescheduleResponseBannerProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  if (rescheduleRequest.status !== 'pending') {
    return null;
  }

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await onAccept();
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) return;
    setRejecting(true);
    try {
      await onReject(rejectNote);
      setShowRejectModal(false);
    } finally {
      setRejecting(false);
    }
  };

  const proposedDate = rescheduleRequest.proposedDate?.toDate?.() || new Date(rescheduleRequest.proposedDate as unknown as string);
  const requesterRole = rescheduleRequest.requestedByRole === 'coach' ? 'Tu coach' : 'El coachee';

  // If current user is the requester, show waiting status
  if (isRequester) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Solicitud de Reprogramación Pendiente
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              Has solicitado reprogramar esta sesión para el{' '}
              <span className="font-medium">
                {proposedDate.toLocaleDateString('es-CL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              a las{' '}
              <span className="font-medium">{rescheduleRequest.proposedStartTime}</span>.
            </p>
            <p className="text-sm text-blue-700">
              Esperando respuesta...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If current user needs to respond
  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Solicitud de Reprogramación
            </h3>
            <p className="text-sm text-amber-800 mb-2">
              {requesterRole} solicita reprogramar esta sesión para el{' '}
              <span className="font-medium">
                {proposedDate.toLocaleDateString('es-CL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              a las{' '}
              <span className="font-medium">{rescheduleRequest.proposedStartTime} - {rescheduleRequest.proposedEndTime}</span>.
            </p>
            {rescheduleRequest.reason && (
              <p className="text-sm text-amber-700 mb-3 italic">
                &quot;{rescheduleRequest.reason}&quot;
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {accepting ? 'Aceptando...' : 'Aceptar'}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rechazar Reprogramación
            </h3>
            <p className="text-gray-600 mb-4">
              Por favor indica por qué no puedes aceptar esta nueva fecha/hora.
            </p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
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
                disabled={rejecting || !rejectNote.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {rejecting ? 'Rechazando...' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
