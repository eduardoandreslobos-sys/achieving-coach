'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCoachingProgram, signAgreement, getProgramSessions } from '@/lib/coachingService';
import { 
  CoachingProgram, 
  Session,
  DEFAULT_CONFIDENTIALITY_NOTE 
} from '@/types/coaching';
import { 
  FileSignature, Check, Clock, AlertCircle, ArrowLeft,
  Calendar, Target, Shield, FileText, ChevronDown, ChevronUp
} from 'lucide-react';

export default function CoacheeProgramPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const programId = params?.programId as string;

  const [program, setProgram] = useState<CoachingProgram | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Acceptance checkboxes
  const [acceptConfidentiality, setAcceptConfidentiality] = useState(false);
  const [acceptAttendance, setAcceptAttendance] = useState(false);
  const [acceptValidity, setAcceptValidity] = useState(false);

  useEffect(() => {
    if (programId && userProfile?.uid) {
      loadData();
    }
  }, [programId, userProfile]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [programData, sessionsData] = await Promise.all([
        getCoachingProgram(programId),
        getProgramSessions(programId)
      ]);
      
      if (programData) {
        setProgram(programData);
        
        // Check if already signed
        const alreadySigned = programData.agreement?.signatures?.some(
          s => s.oduid === userProfile?.uid && s.role === 'coachee'
        );
        if (alreadySigned) {
          setAcceptConfidentiality(true);
          setAcceptAttendance(true);
          setAcceptValidity(true);
        }
      }
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!user || !userProfile || !program?.agreement) return;
    
    if (!acceptConfidentiality || !acceptAttendance || !acceptValidity) {
      alert('Debes aceptar todos los términos para continuar');
      return;
    }

    setSigning(true);
    try {
      const acceptedTerms = [
        'Promesa de Confidencialidad',
        'Política de Asistencia y Cancelación',
        `Vigencia del Acuerdo: ${formatDate(program.agreement.validFrom)} - ${formatDate(program.agreement.validUntil)}`
      ];

      await signAgreement(
        programId,
        userProfile.uid,
        userProfile.displayName || user.email || 'Coachee',
        user.email || '',
        'coachee',
        acceptedTerms
      );

      alert('¡Acuerdo firmado exitosamente!');
      await loadData();
    } catch (error: any) {
      console.error('Error signing:', error);
      alert(error.message || 'Error al firmar');
    } finally {
      setSigning(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No definida';
    try {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('es-CL');
    } catch {
      return 'No definida';
    }
  };

  const hasSignedAsCoachee = program?.agreement?.signatures?.some(
    s => s.oduid === userProfile?.uid && s.role === 'coachee'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Programa no encontrado</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/programs')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a mis programas
        </button>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
              <p className="text-gray-600">{program.description}</p>
            </div>
            <StatusBadge status={program.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <Calendar className="text-primary-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Inicio</p>
              <p className="font-semibold">{formatDate(program.startDate)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <Target className="text-green-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Sesiones</p>
              <p className="font-semibold">{program.sessionsPlanned}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <Clock className="text-blue-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Duración</p>
              <p className="font-semibold">{program.duration} meses</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <FileText className="text-purple-600 mb-2" size={24} />
              <p className="text-sm text-gray-600">Fase Actual</p>
              <p className="font-semibold">{program.currentPhase || 1}</p>
            </div>
          </div>
        </div>

        {/* Pending Signature Section */}
        {program.status === 'pending_acceptance' && program.agreement && !hasSignedAsCoachee && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-600" size={28} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Acuerdo Pendiente de Firma</h2>
                <p className="text-gray-600">Revisa y acepta los términos del acuerdo de coaching</p>
              </div>
            </div>

            {/* Agreement Details Toggle */}
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
            >
              <FileSignature size={18} />
              Ver detalles del acuerdo
              {showTerms ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showTerms && (
              <div className="bg-white rounded-lg p-4 mb-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Objetivo General</h3>
                  <p className="text-gray-700">{program.agreement.generalObjective}</p>
                </div>
                
                {program.agreement.expectedResults && program.agreement.expectedResults.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Resultados Esperados</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {program.agreement.expectedResults.map((result, idx) => (
                        <li key={idx}>{result}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.agreement.competenciesToDevelop && program.agreement.competenciesToDevelop.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Competencias a Desarrollar</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {program.agreement.competenciesToDevelop.map((comp, idx) => (
                        <li key={idx}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tus Responsabilidades como Coachee</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {(program.agreement.coacheeResponsibilities || []).map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Terms Acceptance */}
            <div className="space-y-4">
              {/* Confidentiality */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confidentiality"
                    checked={acceptConfidentiality}
                    onChange={(e) => setAcceptConfidentiality(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <label htmlFor="confidentiality" className="font-semibold text-gray-900 flex items-center gap-2 cursor-pointer">
                      <Shield className="text-primary-600" size={18} />
                      Promesa de Confidencialidad
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      {program.agreement.confidentialityNote || DEFAULT_CONFIDENTIALITY_NOTE}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendance Policy */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="attendance"
                    checked={acceptAttendance}
                    onChange={(e) => setAcceptAttendance(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <label htmlFor="attendance" className="font-semibold text-gray-900 flex items-center gap-2 cursor-pointer">
                      <Calendar className="text-primary-600" size={18} />
                      Política de Asistencia y Cancelación
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      {program.agreement.sessionAttendancePolicy}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Sesiones:</strong> {program.agreement.totalSessions} sesiones
                      {program.agreement.includesObservedSession && ' (incluye sesión de reunión observada)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="validity"
                    checked={acceptValidity}
                    onChange={(e) => setAcceptValidity(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 rounded"
                  />
                  <div>
                    <label htmlFor="validity" className="font-semibold text-gray-900 flex items-center gap-2 cursor-pointer">
                      <FileText className="text-primary-600" size={18} />
                      Vigencia del Acuerdo
                    </label>
                    <p className="text-sm text-gray-700 mt-2">
                      Este acuerdo tiene vigencia desde el <strong>{formatDate(program.agreement.validFrom)}</strong> hasta el <strong>{formatDate(program.agreement.validUntil)}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSign}
                disabled={signing || !acceptConfidentiality || !acceptAttendance || !acceptValidity}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FileSignature size={20} />
                {signing ? 'Firmando...' : 'Firmar Acuerdo'}
              </button>
            </div>
          </div>
        )}

        {/* Already Signed */}
        {hasSignedAsCoachee && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <Check className="text-green-600" size={28} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Acuerdo Firmado</h2>
                <p className="text-gray-600">
                  Has firmado el acuerdo de coaching. 
                  {program.agreement?.signatures && (
                    <span>
                      {' '}Firmas: {program.agreement.signatures.map(s => `${s.name} (${s.role})`).join(', ')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Program Goals */}
        {program.overallGoals && program.overallGoals.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="text-primary-600" size={24} />
              Objetivos del Programa
            </h2>
            <ul className="space-y-2">
              {program.overallGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sessions */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="text-primary-600" size={24} />
              Sesiones Programadas
            </h2>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-600">
                      {session.scheduledDate?.toDate?.()?.toLocaleDateString('es-CL')} - {session.scheduledTime}
                      {session.location && ` • ${session.location}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status === 'completed' ? 'Completada' :
                     session.status === 'in-progress' ? 'En Progreso' :
                     session.status === 'cancelled' ? 'Cancelada' : 'Programada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CoachingProgram['status'] }) {
  const config = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Borrador' },
    pending_acceptance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
    active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Activo' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' },
    paused: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pausado' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
  };

  const { bg, text, label } = config[status] || config.draft;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
