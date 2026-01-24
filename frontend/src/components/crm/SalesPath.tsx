'use client';

import { Check, Circle, ChevronRight } from 'lucide-react';
import { OpportunityStage, STAGE_LABELS, STAGE_PROBABILITIES } from '@/types/crm';

interface SalesPathProps {
  currentStage: OpportunityStage;
  onStageClick?: (stage: OpportunityStage) => void;
  showProbabilities?: boolean;
  compact?: boolean;
}

const stageOrder: OpportunityStage[] = [
  'prospecting',
  'qualification',
  'needs_analysis',
  'proposal',
  'negotiation',
  'closed_won',
];

const stageGuidance: Record<OpportunityStage, { title: string; tips: string[] }> = {
  prospecting: {
    title: 'Identifica al prospecto',
    tips: [
      'Verifica información de contacto',
      'Investiga su perfil y empresa',
      'Prepara tu pitch inicial',
    ],
  },
  qualification: {
    title: 'Califica con BANT',
    tips: [
      'Budget: ¿Tiene presupuesto?',
      'Authority: ¿Toma la decisión?',
      'Need: ¿Qué tan urgente es?',
      'Timeline: ¿Cuándo quiere empezar?',
    ],
  },
  needs_analysis: {
    title: 'Discovery Call',
    tips: [
      'Agenda sesión discovery',
      'Entiende sus desafíos',
      'Identifica metas específicas',
      'Define expectativas del coaching',
    ],
  },
  proposal: {
    title: 'Envía propuesta',
    tips: [
      'Personaliza la propuesta',
      'Incluye programa recomendado',
      'Detalla inversión y duración',
      'Envía y confirma recepción',
    ],
  },
  negotiation: {
    title: 'Cierra el trato',
    tips: [
      'Resuelve objeciones',
      'Ajusta términos si es necesario',
      'Prepara contrato',
      'Define fecha de inicio',
    ],
  },
  closed_won: {
    title: '¡Cliente ganado!',
    tips: [
      'Envía bienvenida',
      'Programa sesión 0',
      'Crea perfil de coachee',
      'Inicia onboarding',
    ],
  },
  closed_lost: {
    title: 'Oportunidad perdida',
    tips: [
      'Documenta razón de pérdida',
      'Agradece su tiempo',
      'Mantén relación para futuro',
    ],
  },
};

export function SalesPath({
  currentStage,
  onStageClick,
  showProbabilities = false,
  compact = false,
}: SalesPathProps) {
  const currentIndex = stageOrder.indexOf(currentStage);
  const isClosedLost = currentStage === 'closed_lost';

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {stageOrder.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = stage === currentStage;
          const isPending = index > currentIndex;

          return (
            <div key={stage} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                title={STAGE_LABELS[stage]}
              />
              {index < stageOrder.length - 1 && (
                <div
                  className={`w-3 h-0.5 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex items-center">
        {stageOrder.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = stage === currentStage;
          const isPending = index > currentIndex;
          const isClickable = onStageClick && !isClosedLost;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              {/* Stage Circle */}
              <button
                onClick={() => isClickable && onStageClick(stage)}
                disabled={!isClickable}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                title={STAGE_LABELS[stage]}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </button>

              {/* Connector Line */}
              {index < stageOrder.length - 1 && (
                <div className="flex-1 h-1 mx-1">
                  <div
                    className={`h-full rounded transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage Labels */}
      <div className="flex items-start mt-2">
        {stageOrder.map((stage, index) => {
          const isCurrent = stage === currentStage;

          return (
            <div key={stage} className="flex-1 last:flex-none last:w-8">
              <p
                className={`text-xs text-center truncate ${
                  isCurrent
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {STAGE_LABELS[stage]}
              </p>
              {showProbabilities && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  {STAGE_PROBABILITIES[stage]}%
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Closed Lost Indicator */}
      {isClosedLost && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            Oportunidad Cerrada - Perdida
          </p>
        </div>
      )}
    </div>
  );
}

interface StageGuidanceProps {
  stage: OpportunityStage;
}

export function StageGuidance({ stage }: StageGuidanceProps) {
  const guidance = stageGuidance[stage];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
        {guidance.title}
      </h4>
      <ul className="space-y-1">
        {guidance.tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
