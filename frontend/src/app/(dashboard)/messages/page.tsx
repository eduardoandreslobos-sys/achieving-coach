'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  createdAt: any;
  read: boolean;
}

interface Contact {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user || !userProfile) return;
      
      try {
        // Coaches ven a sus coachees
        if (userProfile.role === 'coach') {
          const contactsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'coachee'),
            where('coacheeInfo.coachId', '==', user.uid)
          );
          const snapshot = await getDocs(contactsQuery);
          const contactsData = snapshot.docs.map(doc => ({
            uid: doc.id,
            displayName: doc.data().displayName || doc.data().email?.split('@')[0] || 'Coachee',
            email: doc.data().email,
            photoURL: doc.data().photoURL
          })) as Contact[];
          
          setContacts(contactsData);
        } else {
          // Coachees ven solo a su coach - usar getDoc con el ID directamente
          const coachId = userProfile.coacheeInfo?.coachId;
          if (coachId) {
            const coachDocRef = doc(db, 'users', coachId);
            const coachDoc = await getDoc(coachDocRef);
            
            if (coachDoc.exists()) {
              const coachData = coachDoc.data();
              setContacts([{
                uid: coachDoc.id,
                displayName: coachData.displayName || coachData.email?.split('@')[0] || 'Coach',
                email: coachData.email,
                photoURL: coachData.photoURL
              }]);
              // Auto-seleccionar al coach
              setSelectedContact({
                uid: coachDoc.id,
                displayName: coachData.displayName || coachData.email?.split('@')[0] || 'Coach',
                email: coachData.email,
                photoURL: coachData.photoURL
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user, userProfile]);

  useEffect(() => {
    if (!selectedContact || !user) return;

    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, 'messages'),
          orderBy('createdAt', 'asc')
        );
        
        const snapshot = await getDocs(q);
        const allMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];

        // Filtrar mensajes entre el usuario actual y el contacto seleccionado
        const filtered = allMessages.filter(msg => 
          (msg.senderId === user.uid && msg.receiverId === selectedContact.uid) ||
          (msg.senderId === selectedContact.uid && msg.receiverId === user.uid)
        );

        setMessages(filtered);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Refrescar cada 5 segundos
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedContact, user]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact || !user || !userProfile) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        senderName: userProfile.displayName || userProfile.email?.split('@')[0] || 'Unknown',
        receiverId: selectedContact.uid,
        receiverName: selectedContact.displayName,
        text: newMessage,
        createdAt: serverTimestamp(),
        read: false
      });

      setNewMessage('');
      
      // Refrescar mensajes inmediatamente
      const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      const filtered = allMessages.filter(msg => 
        (msg.senderId === user.uid && msg.receiverId === selectedContact.uid) ||
        (msg.senderId === selectedContact.uid && msg.receiverId === user.uid)
      );

      setMessages(filtered);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si es coachee y no tiene coach asignado
  if (userProfile?.role === 'coachee' && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h2>
          <p className="text-gray-500">Your coach will appear here once assigned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Contacts List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <button
              key={contact.uid}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                selectedContact?.uid === contact.uid ? 'bg-primary-50 border-l-4 border-primary-600' : ''
              }`}
            >
              {contact.photoURL ? (
                <Image
                  src={contact.photoURL}
                  alt={contact.displayName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {contact.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">{contact.displayName}</p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              {selectedContact.photoURL ? (
                <Image
                  src={selectedContact.photoURL}
                  alt={selectedContact.displayName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {selectedContact.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{selectedContact.displayName}</p>
                <p className="text-sm text-gray-500">{selectedContact.email}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.senderId === user?.uid
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === user?.uid ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
