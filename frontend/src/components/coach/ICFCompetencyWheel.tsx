'use client';

import React, { useEffect, useRef } from 'react';

interface CompetencyScore {
  competency: string;
  score: number;
}

interface ICFCompetencyWheelProps {
  scores?: CompetencyScore[];
  size?: number;
  showLabels?: boolean;
}

const DEFAULT_COMPETENCIES: CompetencyScore[] = [
  { competency: 'Ethical Practice', score: 4.2 },
  { competency: 'Coaching Mindset', score: 4.5 },
  { competency: 'Agreements', score: 3.8 },
  { competency: 'Trust & Safety', score: 4.8 },
  { competency: 'Presence', score: 4.0 },
  { competency: 'Active Listening', score: 4.6 },
  { competency: 'Evokes Awareness', score: 3.9 },
  { competency: 'Client Growth', score: 4.3 },
];

export default function ICFCompetencyWheel({ 
  scores = DEFAULT_COMPETENCIES, 
  size = 280,
  showLabels = true 
}: ICFCompetencyWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2.8;
    const levels = 5;

    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 1; i <= levels; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / levels) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }

    const numCompetencies = scores.length;
    const angleStep = (2 * Math.PI) / numCompetencies;

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i < numCompetencies; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = '#6366F1';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.lineWidth = 2;

    for (let i = 0; i < numCompetencies; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const scoreRadius = (scores[i].score / 5) * radius;
      const x = centerX + scoreRadius * Math.cos(angle);
      const y = centerY + scoreRadius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#6366F1';
    for (let i = 0; i < numCompetencies; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const scoreRadius = (scores[i].score / 5) * radius;
      const x = centerX + scoreRadius * Math.cos(angle);
      const y = centerY + scoreRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [scores, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="max-w-full" />
      {showLabels && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600 max-w-[280px]">
          {scores.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
              <span className="truncate">{item.competency}</span>
              <span className="font-semibold ml-auto">{item.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
