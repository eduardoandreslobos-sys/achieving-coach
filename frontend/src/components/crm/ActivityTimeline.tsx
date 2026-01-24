'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle,
  Plus,
  Send,
} from 'lucide-react';
import { LeadActivity, ActivityType, OpportunityStage, STAGE_LABELS } from '@/types/crm';

interface ActivityTimelineProps {
  activities: LeadActivity[];
  onAddActivity?: (activity: { type: ActivityType; subject: string; description: string }) => void;
  isLoading?: boolean;
}

const activityConfig: Record<string, {
  icon: typeof Phone;
  label: string;
  color: string;
  bgColor: string;
}> = {
  call: {
    icon: Phone,
    label: 'Llamada',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  email_sent: {
    icon: Mail,
    label: 'Email Enviado',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  email_received: {
    icon: Mail,
    label: 'Email Recibido',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  meeting: {
    icon: Calendar,
    label: 'Reunión',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  video_call: {
    icon: Calendar,
    label: 'Video Call',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  discovery_call: {
    icon: MessageSquare,
    label: 'Discovery Call',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  proposal_sent: {
    icon: FileText,
    label: 'Propuesta Enviada',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  note: {
    icon: MessageSquare,
    label: 'Nota',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
  },
  stage_change: {
    icon: ArrowRight,
    label: 'Cambio de Etapa',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  task_completed: {
    icon: CheckCircle,
    label: 'Tarea Completada',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  follow_up: {
    icon: Phone,
    label: 'Seguimiento',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
};

function ActivityItem({ activity }: { activity: LeadActivity }) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  const formatDate = (timestamp: { toDate: () => Date }) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return date.toLocaleDateString('es-MX', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex gap-3">
      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${config.color}`}>
              {config.label}
            </span>
            {activity.outcome && (
              <span className={`text-xs ${getOutcomeColor(activity.outcome)}`}>
                • {activity.outcome === 'positive' ? 'Positivo' : activity.outcome === 'negative' ? 'Negativo' : 'Neutral'}
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--fg-muted)]">
            {formatDate(activity.createdAt)}
          </span>
        </div>

        <p className="text-sm text-[var(--fg-primary)] mt-0.5">
          {activity.subject}
        </p>

        {activity.description && (
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            {activity.description}
          </p>
        )}

        {/* Stage Change Details */}
        {activity.type === 'stage_change' && activity.previousStage && activity.newStage && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              {STAGE_LABELS[activity.previousStage]}
            </span>
            <ArrowRight className="w-3 h-3 text-[var(--fg-muted)]" />
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">
              {STAGE_LABELS[activity.newStage]}
            </span>
          </div>
        )}

        {/* Duration */}
        {activity.durationMinutes && (
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Duración: {activity.durationMinutes} min
          </p>
        )}
      </div>
    </div>
  );
}

interface QuickActivityFormProps {
  onSubmit: (activity: { type: ActivityType; subject: string; description: string }) => void;
  onCancel: () => void;
}

function QuickActivityForm({ onSubmit, onCancel }: QuickActivityFormProps) {
  const [type, setType] = useState<ActivityType>('note');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onSubmit({ type, subject, description });
    setSubject('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-[var(--bg-secondary)] rounded-lg space-y-3">
      {/* Type Selection */}
      <div className="flex flex-wrap gap-2">
        {(['call', 'email', 'meeting', 'note'] as ActivityType[]).map((actType) => {
          const config = activityConfig[actType];
          const Icon = config.icon;
          return (
            <button
              key={actType}
              type="button"
              onClick={() => setType(actType)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg transition-colors ${
                type === actType
                  ? `${config.bgColor} ${config.color}`
                  : 'bg-[var(--bg-tertiary)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Subject */}
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Asunto..."
        className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        autoFocus
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)..."
        rows={2}
        className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!subject.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-3 h-3" />
          Guardar
        </button>
      </div>
    </form>
  );
}

export function ActivityTimeline({
  activities,
  onAddActivity,
  isLoading = false,
}: ActivityTimelineProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAddActivity = (activity: { type: ActivityType; subject: string; description: string }) => {
    onAddActivity?.(activity);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Activity Button */}
      {onAddActivity && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] border-2 border-dashed border-[var(--border-color)] hover:border-emerald-500/50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar actividad
        </button>
      )}

      {/* Quick Form */}
      {showForm && (
        <QuickActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {/* Connector Line */}
            {index < activities.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-[var(--border-color)] -mb-4" />
            )}
            <ActivityItem activity={activity} />
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-[var(--fg-muted)]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sin actividades registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
