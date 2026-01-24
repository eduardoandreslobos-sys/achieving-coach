'use client';

import { useState } from 'react';
import {
  DollarSign,
  UserCheck,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { BANTQualification as BANTType } from '@/types/crm';

interface BANTQualificationProps {
  bant: BANTType;
  onChange: (bant: BANTType) => void;
  readOnly?: boolean;
  showScore?: boolean;
}

type BANTField = 'budget' | 'authority' | 'need' | 'timeline';

const bantConfig: Record<BANTField, {
  label: string;
  icon: typeof DollarSign;
  question: string;
  options: { value: string; label: string; score: number }[];
}> = {
  budget: {
    label: 'Budget (Presupuesto)',
    icon: DollarSign,
    question: '¿Tiene presupuesto asignado para coaching?',
    options: [
      { value: 'unknown', label: 'Desconocido', score: 0 },
      { value: 'no', label: 'No tiene', score: 0 },
      { value: 'maybe', label: 'Posiblemente', score: 5 },
      { value: 'yes', label: 'Sí, confirmado', score: 10 },
    ],
  },
  authority: {
    label: 'Authority (Autoridad)',
    icon: UserCheck,
    question: '¿Quién toma la decisión de contratación?',
    options: [
      { value: 'unknown', label: 'Desconocido', score: 0 },
      { value: 'influencer', label: 'Influenciador', score: 5 },
      { value: 'decision_maker', label: 'Tomador de decisión', score: 10 },
    ],
  },
  need: {
    label: 'Need (Necesidad)',
    icon: AlertCircle,
    question: '¿Qué tan urgente es su necesidad de coaching?',
    options: [
      { value: 'unknown', label: 'Desconocido', score: 0 },
      { value: 'low', label: 'Baja', score: 0 },
      { value: 'medium', label: 'Media', score: 5 },
      { value: 'high', label: 'Alta', score: 10 },
    ],
  },
  timeline: {
    label: 'Timeline (Tiempo)',
    icon: Clock,
    question: '¿Cuándo planea comenzar el proceso?',
    options: [
      { value: 'unknown', label: 'Desconocido', score: 0 },
      { value: 'later', label: 'Más de 3 meses', score: 0 },
      { value: 'soon', label: '1-3 meses', score: 5 },
      { value: 'immediate', label: 'Inmediato (<1 mes)', score: 10 },
    ],
  },
};

const suggestedQuestions: Record<BANTField, string[]> = {
  budget: [
    '¿Ha considerado invertir en coaching profesional antes?',
    '¿Tiene un rango de inversión en mente para este proceso?',
    '¿Quién aprueba el presupuesto para desarrollo profesional?',
  ],
  authority: [
    '¿Esta decisión la toma usted directamente?',
    '¿Hay otras personas involucradas en la decisión?',
    '¿Su empresa tiene un proceso de aprobación para coaching?',
  ],
  need: [
    '¿Qué situación específica le motivó a buscar un coach?',
    '¿Cómo impacta esta situación en su vida/trabajo actualmente?',
    '¿Qué pasaría si no aborda esta situación pronto?',
  ],
  timeline: [
    '¿Cuándo le gustaría comenzar el proceso de coaching?',
    '¿Hay algún evento o fecha límite que impulse esta decisión?',
    '¿Tiene disponibilidad de agenda para sesiones regulares?',
  ],
};

export function BANTQualification({
  bant,
  onChange,
  readOnly = false,
  showScore = true,
}: BANTQualificationProps) {
  const [expandedField, setExpandedField] = useState<BANTField | null>(null);

  const calculateScore = (field: BANTField, value: string): number => {
    const option = bantConfig[field].options.find((o) => o.value === value);
    return option?.score || 0;
  };

  const totalScore =
    calculateScore('budget', bant.budget) +
    calculateScore('authority', bant.authority) +
    calculateScore('need', bant.need) +
    calculateScore('timeline', bant.timeline);

  const handleFieldChange = (field: BANTField, value: string) => {
    onChange({
      ...bant,
      [field]: value,
    });
  };

  const handleNoteChange = (field: BANTField, note: string) => {
    onChange({
      ...bant,
      notes: {
        ...bant.notes,
        [field]: note,
      },
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 30) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      {showScore && (
        <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
          <span className="text-sm font-medium text-[var(--fg-primary)]">
            BANT Score
          </span>
          <span className={`text-lg font-bold ${getScoreColor(totalScore)}`}>
            {totalScore} / 40
          </span>
        </div>
      )}

      {/* BANT Fields */}
      <div className="space-y-3">
        {(Object.keys(bantConfig) as BANTField[]).map((field) => {
          const config = bantConfig[field];
          const Icon = config.icon;
          const currentValue = bant[field];
          const currentScore = calculateScore(field, currentValue);
          const isExpanded = expandedField === field;
          const note = bant.notes?.[field] || '';

          return (
            <div
              key={field}
              className="border border-[var(--border-color)] rounded-lg overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedField(isExpanded ? null : field)}
                className="w-full flex items-center justify-between p-3 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[var(--fg-muted)]" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[var(--fg-primary)]">
                      {config.label}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {config.options.find((o) => o.value === currentValue)?.label || 'Sin seleccionar'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${
                      currentScore >= 10
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : currentScore >= 5
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {currentScore}/10
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[var(--fg-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--fg-muted)]" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  {/* Question */}
                  <p className="text-sm text-[var(--fg-primary)] mb-3">
                    {config.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {config.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => !readOnly && handleFieldChange(field, option.value)}
                        disabled={readOnly}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          currentValue === option.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                            : 'border-[var(--border-color)] hover:border-[var(--fg-muted)] text-[var(--fg-primary)]'
                        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span>{option.label}</span>
                        <span className="text-xs opacity-60 ml-1">+{option.score}</span>
                      </button>
                    ))}
                  </div>

                  {/* Suggested Questions */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Preguntas sugeridas
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {suggestedQuestions[field].map((question, index) => (
                        <li
                          key={index}
                          className="text-xs text-[var(--fg-muted)] pl-5 relative before:content-['•'] before:absolute before:left-1"
                        >
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  {!readOnly && (
                    <div>
                      <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                        Notas
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => handleNoteChange(field, e.target.value)}
                        placeholder={`Notas sobre ${config.label.toLowerCase()}...`}
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      />
                    </div>
                  )}

                  {readOnly && note && (
                    <div className="p-2 bg-[var(--bg-primary)] rounded text-sm text-[var(--fg-muted)]">
                      {note}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BANTSummaryProps {
  bant: BANTType;
}

export function BANTSummary({ bant }: BANTSummaryProps) {
  const getStatusIcon = (value: string, field: BANTField) => {
    const config = bantConfig[field];
    const option = config.options.find((o) => o.value === value);
    const score = option?.score || 0;

    if (score >= 10) return '✓';
    if (score >= 5) return '~';
    return '?';
  };

  const getStatusColor = (value: string, field: BANTField) => {
    const config = bantConfig[field];
    const option = config.options.find((o) => o.value === value);
    const score = option?.score || 0;

    if (score >= 10) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-gray-400 bg-gray-100 dark:bg-gray-800';
  };

  return (
    <div className="flex gap-1">
      {(Object.keys(bantConfig) as BANTField[]).map((field) => (
        <div
          key={field}
          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${getStatusColor(
            bant[field],
            field
          )}`}
          title={`${bantConfig[field].label}: ${
            bantConfig[field].options.find((o) => o.value === bant[field])?.label
          }`}
        >
          {field[0].toUpperCase()}
        </div>
      ))}
    </div>
  );
}
