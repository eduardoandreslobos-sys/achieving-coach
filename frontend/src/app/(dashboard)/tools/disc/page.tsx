'use client';

import { DISCAssessment } from '@/components/DISCAssessment';

export default function DISCPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Evaluación DISC</h1>
          <p className="text-gray-600 mt-2">
            Descubre tu perfil de comportamiento y estilo de comunicación
          </p>
        </div>
        <DISCAssessment />
      </div>
    </div>
  );
}
