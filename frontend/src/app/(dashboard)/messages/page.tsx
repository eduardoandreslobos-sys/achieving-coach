'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Video, MoreVertical, Plus, Send, X, UserPlus } from 'lucide-react';
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

interface Contact {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: string;
}

export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
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

  // Load available contacts when picker opens
  const loadContacts = async () => {
    if (!user?.uid || !userProfile) return;

    setLoadingContacts(true);
    try {
      const usersRef = collection(db, 'users');
      let contactsList: Contact[] = [];

      if (userProfile.role === 'coach') {
        // Coach sees their clients
        const clientsQuery = query(usersRef, where('coachId', '==', user.uid));
        const clientsSnapshot = await getDocs(clientsQuery);
        contactsList = clientsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: data.uid || doc.id,
            displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Cliente',
            email: data.email || '',
            photoURL: data.photoURL,
            role: data.role || 'coachee',
          };
        });
      } else {
        // Coachee sees their coach
        if (userProfile.coachId) {
          const coachQuery = query(usersRef, where('uid', '==', userProfile.coachId));
          const coachSnapshot = await getDocs(coachQuery);
          if (!coachSnapshot.empty) {
            const coachData = coachSnapshot.docs[0].data();
            contactsList = [{
              uid: coachData.uid || coachSnapshot.docs[0].id,
              displayName: coachData.displayName || `${coachData.firstName || ''} ${coachData.lastName || ''}`.trim() || 'Coach',
              email: coachData.email || '',
              photoURL: coachData.photoURL,
              role: 'coach',
            }];
          }
        }
      }

      // Filter out contacts that already have conversations
      const existingRecipientIds = conversations.map(c => c.recipientId);
      contactsList = contactsList.filter(c => !existingRecipientIds.includes(c.uid));

      setContacts(contactsList);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleOpenContactPicker = () => {
    setShowContactPicker(true);
    setContactSearchQuery('');
    loadContacts();
  };

  const handleSelectContact = async (contact: Contact) => {
    if (!user?.uid) return;

    // Check if conversation already exists
    const existingConv = conversations.find(c => c.recipientId === contact.uid);
    if (existingConv) {
      setSelectedConversation(existingConv);
      setShowContactPicker(false);
      return;
    }

    try {
      // Create new conversation
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [user.uid, contact.uid],
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: {
          [user.uid]: 0,
          [contact.uid]: 0,
        },
        createdAt: serverTimestamp(),
      });

      // Select the new conversation
      const newConversation: Conversation = {
        id: conversationRef.id,
        recipientId: contact.uid,
        recipientName: contact.displayName,
        recipientEmail: contact.email,
        recipientPhoto: contact.photoURL,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
      };

      setSelectedConversation(newConversation);
      setShowContactPicker(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
          <div className="w-80 bg-[#12131a] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 space-y-3">
              <button
                onClick={handleOpenContactPicker}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Nueva Conversación
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar mensajes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b23] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
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
                        (selectedConversation?.id === conv.id ? 'bg-emerald-600/20 border-l-2 border-emerald-500' : 'hover:bg-[#1a1b23]')
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
                          <h4 className={'font-medium ' + (conv.unreadCount > 0 ? 'text-emerald-400' : 'text-white')}>
                            {conv.recipientName}
                          </h4>
                          <span className="text-gray-500 text-xs">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#12131a] border border-gray-800 rounded-xl flex flex-col overflow-hidden">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Selecciona una conversación para comenzar
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
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
                          ? 'bg-emerald-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-md'
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
                <div className="p-4 border-t border-gray-800">
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
                      className="flex-1 px-4 py-2.5 bg-[#1a1b23] border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50"
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

        {/* Contact Picker Modal */}
        {showContactPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#12131a] border border-gray-800 rounded-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">Nueva Conversación</h3>
                <button
                  onClick={() => setShowContactPicker(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar contacto..."
                    value={contactSearchQuery}
                    onChange={(e) => setContactSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b23] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {loadingContacts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {userProfile?.role === 'coach'
                        ? 'No tienes clientes asignados aún'
                        : 'No tienes un coach asignado aún'}
                    </div>
                  ) : (
                    contacts
                      .filter(c =>
                        c.displayName.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                        c.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
                      )
                      .map((contact) => (
                        <div
                          key={contact.uid}
                          onClick={() => handleSelectContact(contact)}
                          className="flex items-center gap-3 p-3 hover:bg-[#1a1b23] rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                            {contact.photoURL ? (
                              <img src={contact.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              contact.displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{contact.displayName}</h4>
                            <p className="text-gray-500 text-sm truncate">{contact.email}</p>
                          </div>
                          <span className="text-xs text-gray-500 capitalize px-2 py-1 bg-[#1a1b23] rounded">
                            {contact.role === 'coach' ? 'Coach' : 'Cliente'}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
