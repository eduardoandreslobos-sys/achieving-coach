'use client';

import React, { useState } from 'react';
import { Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CareerCompassForm from '@/components/tools/CareerCompassForm';
import CareerCompassResults from '@/components/tools/CareerCompassResults';
import { CareerCompass } from '@/types/career';

export default function CareerCompassPage() {
  const [compass, setCompass] = useState<CareerCompass | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleComplete = (completedCompass: CareerCompass) => {
    setCompass(completedCompass);
    setShowResults(true);
  };

  const handleReset = () => {
    setCompass(null);
    setShowResults(false);
  };

  if (showResults && compass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
        </div>
        <CareerCompassResults 
          compass={compass}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-100 p-4 rounded-xl">
              <Compass className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Career Compass Mapping
              </h1>
              <p className="text-gray-600 mt-1">
                Map your career journey and chart your path forward
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-indigo-900 mb-3">
            Navigate Your Career Path
          </h2>
          <div className="space-y-3 text-indigo-800">
            <p>
              The Career Compass helps you gain clarity on where you are, where you want to go, 
              and how to get there. This comprehensive tool examines multiple dimensions of your career.
            </p>
            <div className="bg-white rounded-lg p-4 mt-4">
              <p className="font-medium mb-2">You'll explore:</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div>• Your current career satisfaction</div>
                <div>• Your strengths and interests</div>
                <div>• Your core career values</div>
                <div>• Your ideal career direction</div>
                <div>• Barriers and support systems</div>
                <div>• Concrete next steps</div>
              </div>
            </div>
            <p className="text-sm mt-4">
              <strong>Time commitment:</strong> 15-20 minutes
            </p>
          </div>
        </div>

        {/* Form */}
        <CareerCompassForm onComplete={handleComplete} />

      </div>
    </div>
  );
}
