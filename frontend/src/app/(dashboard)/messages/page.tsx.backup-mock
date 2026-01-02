'use client';

import { useState, useEffect } from 'react';
import { Search, Video, MoreVertical, Plus, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  time: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'John Doe', avatar: '/api/placeholder/40/40', lastMessage: 'Hola Susan, ¿a qué hora es la...', time: '14:30', unread: true, online: true },
  { id: '2', name: 'Soporte', avatar: '', lastMessage: 'Tu ticket #482 ha sido resuelto.', time: 'Ayer', unread: false, online: false },
  { id: '3', name: 'Ana (Admin)', avatar: '', lastMessage: 'Bienvenida a la plataforma.', time: 'Lun', unread: false, online: false },
];

const MESSAGES: Message[] = [
  { id: '1', content: '¡Hola Susan! Espero que estés teniendo una excelente semana.', sender: 'other', time: '10:00' },
  { id: '2', content: 'Quería recordarte que revises el módulo de "Valores" antes de nuestra sesión de mañana. ¡Será muy útil!', sender: 'other', time: '10:02' },
  { id: '3', content: '¡Hola John! Gracias por el recordatorio. Justo estaba por empezar con eso. ¿Nos vemos a las 3 PM, cierto?', sender: 'me', time: '14:30' },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Mensajes</h1>
          <p className="text-gray-400">Comunícate directamente con tu coach</p>
        </div>

        <div className="flex gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="w-80 bg-[#12131a] border border-blue-900/30 rounded-xl overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar mensajes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b23] border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={'flex items-center gap-3 p-4 cursor-pointer transition-colors ' + 
                    (selectedConversation.id === conv.id ? 'bg-blue-600/20 border-l-2 border-blue-500' : 'hover:bg-[#1a1b23]')
                  }
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                      {conv.name.charAt(0)}
                    </div>
                    {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#12131a]"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={'font-medium ' + (conv.unread ? 'text-blue-400' : 'text-white')}>{conv.name}</h4>
                      <span className="text-gray-500 text-xs">{conv.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#12131a] border border-blue-900/30 rounded-xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                  {selectedConversation.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-medium">{selectedConversation.name}</h4>
                  <p className="text-gray-500 text-sm">john.doe@achievingcoach.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1b23] rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1b23] rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center">
                <span className="px-3 py-1 bg-[#1a1b23] text-gray-500 text-xs rounded-full">HOY</span>
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={'flex ' + (msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                  {msg.sender === 'other' && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                      J
                    </div>
                  )}
                  <div className={msg.sender === 'me' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-md'
                    : 'bg-[#1a1b23] text-white rounded-2xl rounded-bl-md px-4 py-3 max-w-md'
                  }>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-blue-900/30">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-4 py-2.5 bg-[#1a1b23] border border-blue-900/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-gray-600 text-xs mt-2">
                Presiona <span className="px-1.5 py-0.5 bg-[#1a1b23] rounded text-gray-400">Enter</span> para enviar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
