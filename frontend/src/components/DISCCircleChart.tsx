'use client';

import React from 'react';
import { DISCCoordinates, DISCScores } from '@/types/disc';

interface DISCCircleChartProps {
  coordinates: DISCCoordinates;
  percentages?: DISCScores;
}

export function DISCCircleChart({ coordinates, percentages }: DISCCircleChartProps) {
  const centerX = 150;
  const centerY = 150;
  const radius = 110;
  
  // Convertir coordenadas a posición
  const pointX = centerX + (coordinates.affiliation / 100) * radius;
  const pointY = centerY - (coordinates.control / 100) * radius;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
        {/* Fondo de cuadrantes */}
        <rect x="30" y="30" width="120" height="120" fill="#dc262615" rx="4" />
        <rect x="150" y="30" width="120" height="120" fill="#eab30815" rx="4" />
        <rect x="30" y="150" width="120" height="120" fill="#3b82f615" rx="4" />
        <rect x="150" y="150" width="120" height="120" fill="#22c55e15" rx="4" />
        
        {/* Letras grandes de fondo */}
        <text x="90" y="105" textAnchor="middle" className="text-5xl font-bold fill-red-200">D</text>
        <text x="210" y="105" textAnchor="middle" className="text-5xl font-bold fill-yellow-200">I</text>
        <text x="90" y="225" textAnchor="middle" className="text-5xl font-bold fill-blue-200">C</text>
        <text x="210" y="225" textAnchor="middle" className="text-5xl font-bold fill-green-200">S</text>
        
        {/* Líneas de cuadrícula */}
        <line x1="150" y1="30" x2="150" y2="270" stroke="#d1d5db" strokeWidth="1" />
        <line x1="30" y1="150" x2="270" y2="150" stroke="#d1d5db" strokeWidth="1" />
        
        {/* Líneas internas */}
        <line x1="90" y1="30" x2="90" y2="270" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="210" y1="30" x2="210" y2="270" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="30" y1="90" x2="270" y2="90" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="30" y1="210" x2="270" y2="210" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 4" />
        
        {/* Etiquetas de ejes */}
        <text x="150" y="20" textAnchor="middle" className="text-xs fill-gray-500">Rápido / Directo</text>
        <text x="150" y="290" textAnchor="middle" className="text-xs fill-gray-500">Reflexivo / Metódico</text>
        <text x="15" y="150" textAnchor="middle" className="text-xs fill-gray-500" transform="rotate(-90, 15, 150)">Orientado a tareas</text>
        <text x="285" y="150" textAnchor="middle" className="text-xs fill-gray-500" transform="rotate(90, 285, 150)">Orientado a personas</text>
        
        {/* Punto de posición con efecto de pulso */}
        <circle
          cx={pointX}
          cy={pointY}
          r="14"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="3"
        />
        <circle
          cx={pointX}
          cy={pointY}
          r="8"
          fill="#3b82f6"
        />
        
        {/* Líneas al punto desde los ejes */}
        <line
          x1={pointX}
          y1="30"
          x2={pointX}
          y2={pointY - 14}
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <line
          x1="30"
          y1={pointY}
          x2={pointX - 14}
          y2={pointY}
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
      </svg>
      
      {/* Leyenda de cuadrantes */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs w-full max-w-[280px]">
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
          <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
          <span className="text-gray-700">D - Dominante</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
          <span className="w-3 h-3 bg-yellow-500 rounded-sm"></span>
          <span className="text-gray-700">I - Influyente</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
          <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
          <span className="text-gray-700">C - Concienzudo</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
          <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
          <span className="text-gray-700">S - Estable</span>
        </div>
      </div>
    </div>
  );
}
