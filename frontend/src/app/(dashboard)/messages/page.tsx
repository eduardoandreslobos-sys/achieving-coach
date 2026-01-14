'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Video, MoreVertical, Plus, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, 
  serverTimestamp, getDocs, doc, updateDoc, or
} from 'firebase/firestore';

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhoto?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
}

export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    if (!user?.uid) return;

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const convs: Conversation[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const recipientId = data.participants.find((p: string) => p !== user.uid);

          // Get recipient info
          const recipientDoc = await getDocs(
            query(collection(db, 'users'), where('uid', '==', recipientId))
          );
          const recipient = recipientDoc.docs[0]?.data();

          convs.push({
            id: docSnap.id,
            recipientId,
            recipientName: recipient?.displayName || recipient?.firstName || 'Usuario',
            recipientEmail: recipient?.email || '',
            recipientPhoto: recipient?.photoURL,
            lastMessage: data.lastMessage || '',
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            unreadCount: data.unreadCount?.[user.uid] || 0,
          });
        }

        setConversations(convs);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading conversations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];
      
      setMessages(msgs);
      
      // Mark as read
      if (user?.uid) {
        updateDoc(doc(db, 'conversations', selectedConversation.id), {
          ['unreadCount.' + user.uid]: 0
        }).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, [selectedConversation?.id, user?.uid]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation?.id || !user?.uid) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Add message
      await addDoc(
        collection(db, 'conversations', selectedConversation.id, 'messages'),
        {
          content: messageContent,
          senderId: user.uid,
          createdAt: serverTimestamp(),
          read: false,
        }
      );

      // Update conversation
      await updateDoc(doc(db, 'conversations', selectedConversation.id), {
        lastMessage: messageContent,
        lastMessageTime: serverTimestamp(),
        ['unreadCount.' + selectedConversation.recipientId]: (selectedConversation.unreadCount || 0) + 1,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return date.toLocaleDateString('es-CL', { weekday: 'short' });
    }
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Mensajes</h1>
          <p className="text-gray-400">Comunícate directamente con tu coach</p>
        </div>

        <div className="flex gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="w-80 bg-[#12131a] border border-blue-900/30 rounded-xl overflow-hidden flex flex-col">
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

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No hay conversaciones aún
                </div>
              ) : (
                conversations
                  .filter(c => c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={'flex items-center gap-3 p-4 cursor-pointer transition-colors ' + 
                        (selectedConversation?.id === conv.id ? 'bg-blue-600/20 border-l-2 border-blue-500' : 'hover:bg-[#1a1b23]')
                      }
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                          {conv.recipientPhoto ? (
                            <img src={conv.recipientPhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            conv.recipientName.charAt(0).toUpperCase()
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={'font-medium ' + (conv.unreadCount > 0 ? 'text-blue-400' : 'text-white')}>
                            {conv.recipientName}
                          </h4>
                          <span className="text-gray-500 text-xs">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#12131a] border border-blue-900/30 rounded-xl flex flex-col overflow-hidden">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Selecciona una conversación para comenzar
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                      {selectedConversation.recipientPhoto ? (
                        <img src={selectedConversation.recipientPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        selectedConversation.recipientName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{selectedConversation.recipientName}</h4>
                      <p className="text-gray-500 text-sm">{selectedConversation.recipientEmail}</p>
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
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No hay mensajes aún. ¡Envía el primero!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={'flex ' + (msg.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
                        {msg.senderId !== user?.uid && (
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                            {selectedConversation.recipientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className={msg.senderId === user?.uid 
                          ? 'bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-md'
                          : 'bg-[#1a1b23] text-white rounded-2xl rounded-bl-md px-4 py-3 max-w-md'
                        }>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
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
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-center text-gray-600 text-xs mt-2">
                    Presiona <span className="px-1.5 py-0.5 bg-[#1a1b23] rounded text-gray-400">Enter</span> para enviar
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
