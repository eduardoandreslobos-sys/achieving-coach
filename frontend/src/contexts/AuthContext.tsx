'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseAvailable } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'coach' | 'coachee';
  name?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  coachProfile?: {
    bio: string;
    specialties: string[];
    certifications?: string[];
  };
  coacheeInfo?: {
    coachId?: string;
  };
  valueProposition?: any;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async (currentUser: User) => {
    if (!isFirebaseAvailable || !db) {
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email || '',
        role: 'coachee',
      });
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          ...userDoc.data(),
        } as UserProfile);
      } else {
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          role: 'coachee',
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email || '',
        role: 'coachee',
      });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadUserProfile(user);
    }
  }, [user, loadUserProfile]);

  useEffect(() => {
    // If Firebase is not available, just set loading to false
    if (!isFirebaseAvailable || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [loadUserProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Authentication is not available. Please check Firebase configuration.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Authentication is not available. Please check Firebase configuration.');
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseAvailable || !auth) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
