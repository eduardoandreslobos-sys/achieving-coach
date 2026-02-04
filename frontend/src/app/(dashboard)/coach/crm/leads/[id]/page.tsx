'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  Linkedin,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import {
  Lead,
  LeadActivity,
  LeadTask,
  OpportunityStage,
  STAGE_LABELS,
  ActivityType,
} from '@/types/crm';
import {
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStage,
  updateBANT,
  getLeadActivities,
  addActivity,
  getLeadTasks,
  createTask,
  completeTask,
} from '@/services/crm.service';
import { FeatureGate } from '@/components/FeatureGate';
import {
  SalesPath,
  StageGuidance,
  BANTQualification,
  LeadScoreBadge,
  LeadScoreRing,
  ActivityTimeline,
} from '@/components/crm';

export default function LeadDetailPage() {
  return (
    <FeatureGate feature="crm.leads" fallback="upgrade-prompt">
      <LeadDetailContent />
    </FeatureGate>
  );
}

function LeadDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'tasks'>('overview');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'follow_up' as LeadTask['type'],
    dueDate: '',
    priority: 'medium' as LeadTask['priority'],
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    linkedInUrl: '',
    estimatedValue: 0,
    expectedCloseDate: '',
    notes: '',
    interestAreas: [] as string[],
  });

  useEffect(() => {
    if (user?.uid && leadId && leadId !== 'new') {
      loadData();
    } else if (leadId === 'new') {
      setIsLoading(false);
      setIsEditing(true);
    }
  }, [user?.uid, leadId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadData, activitiesData, tasksData] = await Promise.all([
        getLeadById(leadId),
        getLeadActivities(leadId),
        getLeadTasks(leadId),
      ]);

      if (leadData) {
        setLead(leadData);
        setEditForm({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || '',
          company: leadData.company || '',
          jobTitle: leadData.jobTitle || '',
          linkedInUrl: leadData.linkedInUrl || '',
          estimatedValue: leadData.estimatedValue,
          expectedCloseDate: leadData.expectedCloseDate
            ? leadData.expectedCloseDate.toDate().toISOString().split('T')[0]
            : '',
          notes: leadData.notes,
          interestAreas: leadData.interestAreas,
        });
      }
      setActivities(activitiesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    setIsSaving(true);
    try {
      await updateLead(leadId, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || undefined,
        company: editForm.company || undefined,
        jobTitle: editForm.jobTitle || undefined,
        linkedInUrl: editForm.linkedInUrl || undefined,
        estimatedValue: editForm.estimatedValue,
        notes: editForm.notes,
        interestAreas: editForm.interestAreas,
      });

      setLead({
        ...lead,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        company: editForm.company,
        jobTitle: editForm.jobTitle,
        linkedInUrl: editForm.linkedInUrl,
        estimatedValue: editForm.estimatedValue,
        notes: editForm.notes,
        interestAreas: editForm.interestAreas,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLead(leadId);
      router.push('/coach/crm/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleStageChange = async (newStage: OpportunityStage) => {
    if (!lead) return;

    try {
      await updateLeadStage(leadId, newStage);

      // Add stage change activity
      const activity = await addActivity(leadId, user!.uid, {
        type: 'stage_change',
        subject: `Cambio de etapa: ${STAGE_LABELS[lead.stage]} → ${STAGE_LABELS[newStage]}`,
        description: '',
      }, lead.stage, newStage);

      setLead({
        ...lead,
        stage: newStage,
        stageChangedAt: { toDate: () => new Date() } as any,
        daysInCurrentStage: 0,
      });
      setActivities([activity, ...activities]);
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleBANTChange = async (bant: Lead['bant']) => {
    if (!lead) return;

    try {
      await updateBANT(leadId, bant);
      setLead({ ...lead, bant });
    } catch (error) {
      console.error('Error updating BANT:', error);
    }
  };

  const handleAddActivity = async (data: { type: ActivityType; subject: string; description: string }) => {
    try {
      const activity = await addActivity(leadId, user!.uid, data);
      setActivities([activity, ...activities]);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.dueDate) return;

    try {
      const task = await createTask(leadId, user!.uid, {
        title: newTask.title,
        type: newTask.type,
        dueDate: Timestamp.fromDate(new Date(newTask.dueDate)),
        priority: newTask.priority,
      });

      setTasks([task, ...tasks]);
      setShowTaskForm(false);
      setNewTask({
        title: '',
        type: 'follow_up',
        dueDate: '',
        priority: 'medium',
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: 'completed', completedAt: { toDate: () => new Date() } as any }
            : t
        )
      );

      // Add activity for completed task
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const activity = await addActivity(leadId, user!.uid, {
          type: 'task_completed',
          subject: `Tarea completada: ${task.title}`,
          description: '',
        });
        setActivities([activity, ...activities]);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-48" />
          <div className="h-32 bg-[var(--bg-tertiary)] rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-[var(--bg-tertiary)] rounded-xl" />
            <div className="h-64 bg-[var(--bg-tertiary)] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--fg-muted)]">Lead no encontrado</p>
        <Link href="/coach/crm/leads" className="text-emerald-600 hover:underline">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/coach/crm/leads"
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-muted)]" />
          </Link>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-xl font-bold text-[var(--fg-primary)] bg-transparent border-b-2 border-emerald-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-xl font-bold text-[var(--fg-primary)]">{lead.name}</h1>
            )}
            {lead.company && (
              <p className="text-sm text-[var(--fg-muted)] flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {lead.company}
                {lead.jobTitle && ` • ${lead.jobTitle}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sales Path */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
        <SalesPath
          currentStage={lead.stage}
          onStageClick={handleStageChange}
          showProbabilities
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage Guidance */}
          {!['closed_won', 'closed_lost'].includes(lead.stage) && (
            <StageGuidance stage={lead.stage} />
          )}

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)]">
            <div className="flex gap-4">
              {(['overview', 'activities', 'tasks'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
                  }`}
                >
                  {tab === 'overview' && 'Resumen'}
                  {tab === 'activities' && `Actividades (${activities.length})`}
                  {tab === 'tasks' && `Tareas (${pendingTasks.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
                <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-4">
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[var(--fg-muted)]" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded"
                      />
                    ) : (
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        {lead.email}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[var(--fg-muted)]" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded"
                        placeholder="Teléfono"
                      />
                    ) : lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--fg-muted)]">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-[var(--fg-muted)]" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded"
                        placeholder="Empresa"
                      />
                    ) : (
                      <span className="text-sm text-[var(--fg-primary)]">
                        {lead.company || '-'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-[var(--fg-muted)]" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={editForm.linkedInUrl}
                        onChange={(e) => setEditForm({ ...editForm, linkedInUrl: e.target.value })}
                        className="flex-1 px-2 py-1 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded"
                        placeholder="LinkedIn URL"
                      />
                    ) : lead.linkedInUrl ? (
                      <a
                        href={lead.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        Ver perfil
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--fg-muted)]">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Value Info */}
              <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
                <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-4">
                  Oportunidad
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--fg-muted)] mb-1">Valor Estimado</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.estimatedValue}
                        onChange={(e) =>
                          setEditForm({ ...editForm, estimatedValue: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 text-lg font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded"
                      />
                    ) : (
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(lead.estimatedValue)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--fg-muted)] mb-1">Probabilidad</p>
                    <p className="text-lg font-bold text-[var(--fg-primary)]">
                      {lead.probability}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--fg-muted)] mb-1">Valor Ponderado</p>
                    <p className="text-lg font-bold text-[var(--fg-primary)]">
                      {formatCurrency(lead.estimatedValue * (lead.probability / 100))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--fg-muted)] mb-1">Cierre Esperado</p>
                    <p className="text-sm text-[var(--fg-primary)]">
                      {lead.expectedCloseDate ? formatDate(lead.expectedCloseDate) : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
                <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-2">Notas</h3>
                {isEditing ? (
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg resize-none"
                    placeholder="Notas sobre este lead..."
                  />
                ) : (
                  <p className="text-sm text-[var(--fg-muted)] whitespace-pre-wrap">
                    {lead.notes || 'Sin notas'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
              <ActivityTimeline
                activities={activities}
                onAddActivity={handleAddActivity}
              />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Add Task Button */}
              {!showTaskForm && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border-color)] rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:border-emerald-500/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Tarea
                </button>
              )}

              {/* Task Form */}
              {showTaskForm && (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4 space-y-3">
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Título de la tarea..."
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm"
                    autoFocus
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                      className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm"
                    >
                      <option value="follow_up">Seguimiento</option>
                      <option value="call">Llamada</option>
                      <option value="email">Email</option>
                      <option value="meeting">Reunión</option>
                      <option value="send_proposal">Enviar propuesta</option>
                      <option value="other">Otro</option>
                    </select>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="px-3 py-1.5 text-sm text-[var(--fg-muted)]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateTask}
                      disabled={!newTask.title || !newTask.dueDate}
                      className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                    >
                      Crear
                    </button>
                  </div>
                </div>
              )}

              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--fg-primary)]">
                    Pendientes ({pendingTasks.length})
                  </h4>
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]"
                    >
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="w-5 h-5 rounded-full border-2 border-[var(--border-color)] hover:border-emerald-500 transition-colors"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--fg-primary)]">
                          {task.title}
                        </p>
                        <p className="text-xs text-[var(--fg-muted)]">
                          {task.dueDate?.toDate().toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          task.priority === 'high'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                        }`}
                      >
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--fg-muted)]">
                    Completadas ({completedTasks.length})
                  </h4>
                  {completedTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg opacity-60"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div className="flex-1">
                        <p className="text-sm text-[var(--fg-muted)] line-through">
                          {task.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pendingTasks.length === 0 && completedTasks.length === 0 && (
                <div className="text-center py-8 text-[var(--fg-muted)]">
                  <p>Sin tareas</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - BANT & Score */}
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-4">
              Lead Score
            </h3>
            <div className="flex items-center justify-center mb-4">
              <LeadScoreRing
                score={lead.totalScore}
                category={lead.scoreCategory}
                size={100}
              />
            </div>
            <div className="text-center">
              <LeadScoreBadge
                score={lead.totalScore}
                category={lead.scoreCategory}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--fg-muted)]">BANT Score</span>
                <span className="text-[var(--fg-primary)]">{lead.bantScore}/40</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--fg-muted)]">Engagement</span>
                <span className="text-[var(--fg-primary)]">{lead.engagementScore}/30</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--fg-muted)]">Fit</span>
                <span className="text-[var(--fg-primary)]">{lead.fitScore}/30</span>
              </div>
            </div>
          </div>

          {/* BANT Qualification */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-4">
              Calificación BANT
            </h3>
            <BANTQualification
              bant={lead.bant}
              onChange={handleBANTChange}
              readOnly={['closed_won', 'closed_lost'].includes(lead.stage)}
            />
          </div>

          {/* Metadata */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--fg-muted)]">Fuente</span>
              <span className="text-[var(--fg-primary)] capitalize">{lead.source}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--fg-muted)]">Creado</span>
              <span className="text-[var(--fg-primary)]">{formatDate(lead.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--fg-muted)]">Último contacto</span>
              <span className="text-[var(--fg-primary)]">
                {lead.lastContactedAt ? formatDate(lead.lastContactedAt) : '-'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--fg-muted)]">Días en etapa</span>
              <span
                className={`${
                  lead.daysInCurrentStage > 14
                    ? 'text-red-500'
                    : lead.daysInCurrentStage > 7
                    ? 'text-amber-500'
                    : 'text-[var(--fg-primary)]'
                }`}
              >
                {lead.daysInCurrentStage}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Eliminar Lead
            </h3>
            <p className="text-[var(--fg-muted)] mb-6">
              ¿Estás seguro de que quieres eliminar a {lead.name}? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
