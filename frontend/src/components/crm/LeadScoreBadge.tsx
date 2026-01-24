'use client';

import { Flame, Thermometer, Sun, Snowflake } from 'lucide-react';

export type ScoreCategory = 'hot' | 'warm' | 'neutral' | 'cold';

interface LeadScoreBadgeProps {
  score: number;
  category: ScoreCategory;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const categoryConfig: Record<ScoreCategory, {
  label: string;
  icon: typeof Flame;
  bgClass: string;
  textClass: string;
  iconClass: string;
}> = {
  hot: {
    label: 'Caliente',
    icon: Flame,
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
    iconClass: 'text-red-500',
  },
  warm: {
    label: 'Tibio',
    icon: Thermometer,
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-700 dark:text-orange-400',
    iconClass: 'text-orange-500',
  },
  neutral: {
    label: 'Neutral',
    icon: Sun,
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-700 dark:text-yellow-400',
    iconClass: 'text-yellow-500',
  },
  cold: {
    label: 'Frío',
    icon: Snowflake,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-400',
    iconClass: 'text-blue-500',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 text-xs gap-1',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-2.5 py-1 text-sm gap-1.5',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-3 py-1.5 text-base gap-2',
    icon: 'w-5 h-5',
  },
};

export function LeadScoreBadge({
  score,
  category,
  showScore = true,
  size = 'md'
}: LeadScoreBadgeProps) {
  const config = categoryConfig[category];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${config.bgClass} ${config.textClass} ${sizeStyles.container}`}
    >
      <Icon className={`${sizeStyles.icon} ${config.iconClass}`} />
      <span>{config.label}</span>
      {showScore && (
        <span className="opacity-75">({score})</span>
      )}
    </div>
  );
}

interface LeadScoreRingProps {
  score: number;
  category: ScoreCategory;
  size?: number;
}

export function LeadScoreRing({ score, category, size = 60 }: LeadScoreRingProps) {
  const config = categoryConfig[category];
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const strokeColor = {
    hot: '#ef4444',
    warm: '#f97316',
    neutral: '#eab308',
    cold: '#3b82f6',
  }[category];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${config.textClass}`}>{score}</span>
      </div>
    </div>
  );
}

export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 40) return 'neutral';
  return 'cold';
}
