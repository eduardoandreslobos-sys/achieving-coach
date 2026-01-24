'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Video, MoreVertical, Plus, Send, X, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection, query, where, orderBy, onSnapshot, addDoc,
  serverTimestamp, getDocs, doc, updateDoc, limit, documentId
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

  // Load conversations with optimized batch query (fixes N+1 problem)
  useEffect(() => {
    if (!user?.uid) return;

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc'),
      limit(50) // Pagination: limit to 50 most recent conversations
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Step 1: Collect all recipient IDs
        const conversationData = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            data,
            recipientId: data.participants.find((p: string) => p !== user.uid) as string
          };
        });

        const recipientIds = [...new Set(conversationData.map(c => c.recipientId).filter(Boolean))];

        // Step 2: Batch fetch all recipients in a single query (max 30 per query due to Firestore limit)
        const recipientMap: Record<string, any> = {};

        // Firestore 'in' queries are limited to 30 items, so we batch them
        const batches = [];
        for (let i = 0; i < recipientIds.length; i += 30) {
          batches.push(recipientIds.slice(i, i + 30));
        }

        await Promise.all(
          batches.map(async (batch) => {
            if (batch.length === 0) return;
            const usersQuery = query(
              collection(db, 'users'),
              where('uid', 'in', batch)
            );
            const usersSnapshot = await getDocs(usersQuery);
            usersSnapshot.docs.forEach(doc => {
              const userData = doc.data();
              recipientMap[userData.uid] = userData;
            });
          })
        );

        // Step 3: Build conversations array using the map
        const convs: Conversation[] = conversationData.map(({ id, data, recipientId }) => {
          const recipient = recipientMap[recipientId];
          return {
            id,
            recipientId,
            recipientName: recipient?.displayName || recipient?.firstName || 'Usuario',
            recipientEmail: recipient?.email || '',
            recipientPhoto: recipient?.photoURL,
            lastMessage: data.lastMessage || '',
            lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
            unreadCount: data.unreadCount?.[user.uid] || 0,
          };
        });

        // Step 4: Deduplicate - keep only the most recent conversation per recipient
        const deduplicatedConvs = convs.reduce((acc, conv) => {
          const existing = acc.find(c => c.recipientId === conv.recipientId);
          if (!existing) {
            acc.push(conv);
          } else if (conv.lastMessageTime > existing.lastMessageTime) {
            // Replace with more recent conversation
            const index = acc.indexOf(existing);
            acc[index] = conv;
          }
          return acc;
        }, [] as Conversation[]);

        setConversations(deduplicatedConvs);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading conversations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Load messages for selected conversation (with pagination)
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const messagesRef = collection(db, 'conversations', selectedConversation.id, 'messages');
    // Get last 100 messages, ordered by most recent first, then reverse for display
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      })) as Message[];

      // Reverse to show in chronological order (oldest first)
      setMessages(msgs.reverse());

      // Mark as read
      if (user?.uid) {
        updateDoc(doc(db, 'conversations', selectedConversation.id), {
          ['unreadCount.' + user.uid]: 0
        }).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, [selectedConversation?.id, user?.uid]);

  // Auto-select first conversation when conversations load and none is selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

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
        const clientsQuery = query(usersRef, where('coacheeInfo.coachId', '==', user.uid));
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

    // Check if conversation already exists in local state
    const existingConv = conversations.find(c => c.recipientId === contact.uid);
    if (existingConv) {
      setSelectedConversation(existingConv);
      setShowContactPicker(false);
      return;
    }

    try {
      // Double-check in Firestore to prevent duplicates
      const existingQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', user.uid)
      );
      const existingSnapshot = await getDocs(existingQuery);
      const existingInDb = existingSnapshot.docs.find(doc => {
        const participants = doc.data().participants as string[];
        return participants.includes(contact.uid);
      });

      if (existingInDb) {
        // Conversation exists in DB, use it
        const data = existingInDb.data();
        const existingConversation: Conversation = {
          id: existingInDb.id,
          recipientId: contact.uid,
          recipientName: contact.displayName,
          recipientEmail: contact.email,
          recipientPhoto: contact.photoURL,
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
          unreadCount: data.unreadCount?.[user.uid] || 0,
        };
        setSelectedConversation(existingConversation);
        setShowContactPicker(false);
        return;
      }

      // Create new conversation only if none exists
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
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Mensajes</h1>
          <p className="text-[var(--fg-muted)]">Comunícate directamente con tu coach</p>
        </div>

        <div className="flex gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 space-y-3">
              <button
                onClick={handleOpenContactPicker}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[var(--fg-primary)] rounded-lg transition-colors font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Nueva Conversación
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
                <input
                  type="text"
                  placeholder="Buscar mensajes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-[var(--fg-muted)]">
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
                        (selectedConversation?.id === conv.id ? 'bg-emerald-600/20 border-l-2 border-emerald-500' : 'hover:bg-[var(--bg-tertiary)]')
                      }
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-[var(--fg-primary)] font-medium overflow-hidden">
                          {conv.recipientPhoto ? (
                            <img src={conv.recipientPhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            conv.recipientName.charAt(0).toUpperCase()
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={'font-medium ' + (conv.unreadCount > 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--fg-primary)]')}>
                            {conv.recipientName}
                          </h4>
                          <span className="text-[var(--fg-muted)] text-xs">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-[var(--fg-muted)] text-sm truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-emerald-600 text-[var(--fg-primary)] text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex flex-col overflow-hidden">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-[var(--fg-muted)]">
                Selecciona una conversación para comenzar
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-[var(--fg-primary)] font-medium overflow-hidden">
                      {selectedConversation.recipientPhoto ? (
                        <img src={selectedConversation.recipientPhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        selectedConversation.recipientName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-[var(--fg-primary)] font-medium">{selectedConversation.recipientName}</h4>
                      <p className="text-[var(--fg-muted)] text-sm">{selectedConversation.recipientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button
                        className="p-2 text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-not-allowed opacity-60"
                        title="Próximamente"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Próximamente
                      </div>
                    </div>
                    <div className="relative group">
                      <button
                        className="p-2 text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-not-allowed opacity-60"
                        title="Próximamente"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Próximamente
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-[var(--fg-muted)] py-8">
                      No hay mensajes aún. ¡Envía el primero!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={'flex ' + (msg.senderId === user?.uid ? 'justify-end' : 'justify-start')}>
                        {msg.senderId !== user?.uid && (
                          <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-[var(--fg-primary)] text-sm mr-2 flex-shrink-0">
                            {selectedConversation.recipientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className={msg.senderId === user?.uid 
                          ? 'bg-emerald-600 text-[var(--fg-primary)] rounded-2xl rounded-br-md px-4 py-3 max-w-md'
                          : 'bg-[var(--bg-tertiary)] text-[var(--fg-primary)] rounded-2xl rounded-bl-md px-4 py-3 max-w-md'
                        }>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <button
                        className="p-2 text-[var(--fg-muted)] transition-colors cursor-not-allowed opacity-60"
                        title="Próximamente"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Próximamente
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-emerald-600 text-[var(--fg-primary)] rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-center text-[var(--fg-muted)] text-xs mt-2">
                    Presiona <span className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--fg-muted)]">Enter</span> para enviar
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Picker Modal */}
        {showContactPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-[var(--fg-primary)]">Nueva Conversación</h3>
                <button
                  onClick={() => setShowContactPicker(false)}
                  className="p-1 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
                  <input
                    type="text"
                    placeholder="Buscar contacto..."
                    value={contactSearchQuery}
                    onChange={(e) => setContactSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {loadingContacts ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-[var(--fg-muted)]">
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
                          className="flex items-center gap-3 p-3 hover:bg-[var(--bg-tertiary)] rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-[var(--fg-primary)] font-medium overflow-hidden">
                            {contact.photoURL ? (
                              <img src={contact.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              contact.displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[var(--fg-primary)] font-medium truncate">{contact.displayName}</h4>
                            <p className="text-[var(--fg-muted)] text-sm truncate">{contact.email}</p>
                          </div>
                          <span className="text-xs text-[var(--fg-muted)] capitalize px-2 py-1 bg-[var(--bg-tertiary)] rounded">
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
