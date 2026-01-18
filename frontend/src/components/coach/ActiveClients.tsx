'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'onboarding' | 'completed';
}

interface ActiveClientsProps {
  clients: Client[];
  maxVisible?: number;
  onClientClick?: (clientId: string) => void;
  onViewAll?: () => void;
}

export default function ActiveClients({ 
  clients, 
  maxVisible = 8,
  onClientClick,
  onViewAll 
}: ActiveClientsProps) {
  const visibleClients = clients.slice(0, maxVisible);
  const remainingCount = Math.max(0, clients.length - maxVisible);

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No active clients</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'from-blue-400 to-emerald-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-orange-400 to-orange-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visibleClients.map((client, index) => (
          <button
            key={client.id}
            onClick={() => onClientClick?.(client.id)}
            className="group relative"
            title={client.name}
          >
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white hover:ring-primary-500 transition-all"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white hover:ring-primary-500 transition-all`}>
                {getInitials(client.name)}
              </div>
            )}
            
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              client.status === 'active' ? 'bg-green-500' :
              client.status === 'onboarding' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`} />

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {client.name}
            </div>
          </button>
        ))}

        {remainingCount > 0 && (
          <button
            onClick={onViewAll}
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-colors"
            title={`View ${remainingCount} more`}
          >
            +{remainingCount}
          </button>
        )}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All Clients →
        </button>
      )}
    </div>
  );
}
