'use client';

import React from 'react';
import { FileText, Video, Download, ExternalLink } from 'lucide-react';

const mockResources = [
  {
    id: '1',
    title: 'Guía del Marco de Establecimiento de Objetivos',
    type: 'pdf',
    description: 'Una guía completa para establecer y alcanzar objetivos significativos.',
    category: 'Guías',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Webinar de Desarrollo de Liderazgo',
    type: 'video',
    description: 'Grabación de nuestro taller reciente sobre liderazgo.',
    category: 'Videos',
    duration: '45 min',
  },
  {
    id: '3',
    title: 'Plantilla de Reflexión Semanal',
    type: 'document',
    description: 'Usa esta plantilla para tus reflexiones semanales de coaching.',
    category: 'Plantillas',
    size: '125 KB',
  },
  {
    id: '4',
    title: 'Lista de Lectura Recomendada',
    type: 'link',
    description: 'Libros y artículos para el desarrollo personal.',
    category: 'Lectura',
    url: 'https://example.com',
  },
];

export default function ResourcesPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'document': return FileText;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-500/20 text-red-400';
      case 'video': return 'bg-blue-500/20 text-blue-400';
      case 'document': return 'bg-emerald-500/20 text-emerald-400';
      case 'link': return 'bg-violet-500/20 text-violet-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recursos</h1>
          <p className="text-gray-400">Herramientas, guías y materiales para apoyar tu crecimiento.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mockResources.map((resource) => {
            const Icon = getIcon(resource.type);
            const iconColor = getIconColor(resource.type);

            return (
              <div
                key={resource.id}
                className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5 hover:border-blue-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={iconColor + ' p-3 rounded-xl'}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{resource.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{resource.category}</span>
                        {resource.size && <span>{resource.size}</span>}
                        {resource.duration && <span>{resource.duration}</span>}
                      </div>
                      <button className={resource.type === 'link' 
                        ? 'flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                        : 'flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
                      }>
                        {resource.type === 'link' ? <ExternalLink size={14} /> : <Download size={14} />}
                        {resource.type === 'link' ? 'Abrir' : 'Descargar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
