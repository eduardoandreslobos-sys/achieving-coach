'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp, or } from 'firebase/firestore';
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
        let contactsQuery;
        
        // Coaches ven a sus coachees
        if (userProfile.role === 'coach') {
          contactsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'coachee'),
            where('coacheeInfo.coachId', '==', user.uid)
          );
        } else {
          // Coachees ven solo a su coach
          if (userProfile.coacheeInfo?.coachId) {
            const coachDoc = await getDocs(
              query(collection(db, 'users'), where('uid', '==', userProfile.coacheeInfo.coachId))
            );
            if (!coachDoc.empty) {
              const coachData = coachDoc.docs[0].data();
              setContacts([{
                uid: coachDoc.docs[0].id,
                displayName: coachData.displayName || 'Coach',
                email: coachData.email,
                photoURL: coachData.photoURL
              }]);
            }
          }
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(contactsQuery);
        const contactsData = snapshot.docs.map(doc => ({
          uid: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email,
          photoURL: doc.data().photoURL
        })) as Contact[];
        
        setContacts(contactsData);
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
        senderName: userProfile.displayName || 'Unknown',
        receiverId: selectedContact.uid,
        receiverName: selectedContact.displayName,
        text: newMessage,
        createdAt: serverTimestamp(),
        read: false
      });

      setNewMessage('');
      
      // Refrescar mensajes
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
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h2>
          <p className="text-gray-600">
            {userProfile?.role === 'coach' 
              ? 'Invite clients to start messaging'
              : 'Your coach will appear here once assigned'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Contacts List */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.uid}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                selectedContact?.uid === contact.uid ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {contact.photoURL ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={contact.photoURL}
                      alt={contact.displayName || 'Contact'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{contact.displayName}</p>
                  <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                {selectedContact.photoURL ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedContact.photoURL}
                      alt={selectedContact.displayName || 'Contact'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedContact.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{selectedContact.displayName}</p>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === user?.uid;
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-4 py-2 rounded-lg ${
                      isOwn ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                        {message.createdAt?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
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
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <p>Select a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
