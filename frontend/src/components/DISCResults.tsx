'use client';

import React, { useEffect, useState } from 'react';
import { getDISCResult } from '@/lib/discService';
import { DISCResult } from '@/types/disc';
import { Loader2, Download, Share2, ArrowLeft } from 'lucide-react';
import { DISCCircleChart } from './DISCCircleChart';
import { DISCBarChart } from './DISCBarChart';
import Link from 'next/link';

interface DISCResultsProps {
  resultId: string;
}

export function DISCResults({ resultId }: DISCResultsProps) {
  const [result, setResult] = useState<DISCResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      loadResult();
    }
  }, [resultId]);

  async function loadResult() {
    try {
      setLoading(true);
      const data = await getDISCResult(resultId);
      setResult(data);
    } catch (error) {
      console.error('Error loading result:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-center text-gray-600">
          No se encontraron resultados.
        </p>
        <div className="text-center mt-4">
          <Link href="/tools/disc" className="text-blue-600 hover:underline">
            Realizar evaluación DISC
          </Link>
        </div>
      </div>
    );
  }

  const { profile } = result;
  const completedDate = result.completedAt?.toDate?.() 
    ? result.completedAt.toDate().toLocaleDateString('es-ES')
    : 'Fecha no disponible';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header con acciones */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href="/tools/disc" 
              className="text-blue-600 hover:underline text-sm flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a DISC
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Tu Perfil DISC
            </h1>
            <p className="text-gray-600 mt-1">
              Completado el {completedDate}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
            <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Perfil Principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {profile.primaryStyle}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.profileInfo.name}</h2>
            <p className="text-blue-100">Estilo primario: {profile.primaryStyle}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-blue-50">
          {profile.profileInfo.description}
        </p>
      </div>

      {/* Visualizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Círculo Interpersonal */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Círculo Interpersonal</h3>
          <DISCCircleChart coordinates={profile.coordinates} />
        </div>

        {/* Gráfico de Barras */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución DISC</h3>
          <DISCBarChart percentages={profile.percentages} />
        </div>
      </div>

      {/* Fortalezas y Áreas de Desarrollo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
            Fortalezas
          </h3>
          <ul className="space-y-3">
            {profile.profileInfo.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">!</span>
            Áreas de Desarrollo
          </h3>
          <ul className="space-y-3">
            {profile.profileInfo.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span className="text-gray-700">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detalles Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💼 Estilo de Trabajo</h3>
          <p className="text-gray-700">{profile.profileInfo.workStyle}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 Comunicación</h3>
          <p className="text-gray-700">{profile.profileInfo.communication}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Motivación</h3>
          <p className="text-gray-700">{profile.profileInfo.motivation}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">😰 Respuesta al Estrés</h3>
          <p className="text-gray-700">{profile.profileInfo.stressResponse}</p>
        </div>
      </div>

      {/* CTA para nueva evaluación */}
      <div className="bg-gray-50 rounded-xl border p-6 text-center">
        <p className="text-gray-600 mb-4">¿Quieres realizar otra evaluación o compartir con tu coach?</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/tools/disc"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nueva Evaluación
          </Link>
          <Link 
            href="/tools"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Ver otras herramientas
          </Link>
        </div>
      </div>
    </div>
  );
}
