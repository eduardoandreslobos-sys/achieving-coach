'use client';

import React from 'react';
import { DISCScores } from '@/types/disc';

interface DISCBarChartProps {
  percentages: DISCScores;
}

const DISC_CONFIG = {
  D: { label: 'Dominancia', color: '#dc2626', bgColor: '#fef2f2', description: 'Directo, decidido, orientado a resultados' },
  I: { label: 'Influencia', color: '#eab308', bgColor: '#fefce8', description: 'Entusiasta, optimista, colaborativo' },
  S: { label: 'Serenidad', color: '#22c55e', bgColor: '#f0fdf4', description: 'Paciente, confiable, trabajo en equipo' },
  C: { label: 'Cumplimiento', color: '#3b82f6', bgColor: '#eff6ff', description: 'Analítico, preciso, orientado a calidad' },
};

export function DISCBarChart({ percentages }: DISCBarChartProps) {
  const dimensions: Array<keyof DISCScores> = ['D', 'I', 'S', 'C'];
  const maxPercentage = Math.max(...Object.values(percentages));

  // Encontrar el estilo dominante
  const dominantStyle = dimensions.reduce((a, b) => 
    percentages[a] > percentages[b] ? a : b
  );

  return (
    <div className="space-y-6">
      {/* Gráfico de barras vertical estilo DISC */}
      <div className="flex items-end justify-center gap-4 h-[200px] px-4">
        {dimensions.map((dim) => {
          const config = DISC_CONFIG[dim];
          const height = (percentages[dim] / 100) * 180;
          const isDominant = dim === dominantStyle;
          
          return (
            <div key={dim} className="flex flex-col items-center gap-2">
              {/* Valor */}
              <span className={`text-sm font-bold ${isDominant ? 'text-gray-900' : 'text-gray-600'}`}>
                {percentages[dim]}%
              </span>
              
              {/* Barra */}
              <div className="relative w-14 h-[180px] bg-gray-100 rounded-t-lg overflow-hidden flex items-end">
                <div
                  className="w-full rounded-t-lg transition-all duration-1000 ease-out"
                  style={{
                    height: `${height}px`,
                    backgroundColor: config.color,
                    boxShadow: isDominant ? `0 0 12px ${config.color}50` : 'none',
                  }}
                />
                {isDominant && (
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                )}
              </div>
              
              {/* Letra */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  isDominant ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ 
                  backgroundColor: config.color,
                  
                }}
              >
                {dim}
              </div>
            </div>
          );
        })}
      </div>

      {/* Línea de perfil conectando los puntos */}
      <div className="relative h-2 mx-8">
        <svg className="w-full h-16 -mt-6" viewBox="0 0 300 60" preserveAspectRatio="none">
          <polyline
            points={dimensions.map((dim, i) => {
              const x = 37.5 + (i * 75);
              const y = 50 - (percentages[dim] / 100) * 40;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {dimensions.map((dim, i) => {
            const x = 37.5 + (i * 75);
            const y = 50 - (percentages[dim] / 100) * 40;
            return (
              <circle
                key={dim}
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Descripción de cada dimensión */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {dimensions.map((dim) => {
          const config = DISC_CONFIG[dim];
          const isDominant = dim === dominantStyle;
          
          return (
            <div
              key={dim}
              className={`p-3 rounded-lg border-2 transition-all ${
                isDominant 
                  ? 'border-current shadow-sm' 
                  : 'border-transparent bg-gray-50'
              }`}
              style={{ 
                backgroundColor: isDominant ? config.bgColor : undefined,
                borderColor: isDominant ? config.color : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: config.color }}
                >
                  {dim}
                </span>
                <span className="font-semibold text-gray-900 text-sm">{config.label}</span>
                {isDominant && (
                  <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full ml-auto">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">{config.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
