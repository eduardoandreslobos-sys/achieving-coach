'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function JoinCoachPage() {
  const params = useParams();
  const router = useRouter();
  const coachId = params?.coachId as string;

  const [coachInfo, setCoachInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    const fetchCoach = async () => {
      const logs: string[] = [];
      logs.push(`Starting fetch for coachId: ${coachId}`);
      
      try {
        logs.push('Attempting to fetch coach document...');
        const coachDoc = await getDoc(doc(db, 'users', coachId));
        
        logs.push(`Document exists: ${coachDoc.exists()}`);
        
        if (coachDoc.exists()) {
          const data = coachDoc.data();
          logs.push(`Coach role: ${data.role}`);
          
          if (data.role === 'coach') {
            setCoachInfo({ uid: coachDoc.id, ...data });
            logs.push('✅ Coach found and validated');
          } else {
            logs.push(`❌ User is not a coach. Role: ${data.role}`);
            setError(`This user is not a coach. Role: ${data.role}`);
          }
        } else {
          logs.push('❌ Coach document does not exist');
          setError('Invalid invitation link - coach not found');
        }
      } catch (err: any) {
        logs.push(`❌ Error: ${err.message}`);
        logs.push(`Error code: ${err.code || 'N/A'}`);
        setError(`Failed to load coach information: ${err.message}`);
      } finally {
        setDebugInfo(logs);
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoach();
    } else {
      setError('No coach ID provided');
      setLoading(false);
    }
  }, [coachId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        role: 'coachee',
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        coacheeInfo: {
          coachId: coachId,
          coachName: coachInfo?.displayName || coachInfo?.firstName || `${coachInfo?.firstName || ""} ${coachInfo?.lastName || ""}`.trim() || "Coach",
          onboardingCompleted: true,
          goals: [],
        },
        createdAt: serverTimestamp(),
        subscriptionStatus: 'active',
        updatedAt: serverTimestamp(),
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coach information...</p>
        </div>
      </div>
    );
  }

  if (error && !coachInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl border-2 border-red-200 p-8">
            <div className="text-center mb-6">
              <AlertCircle className="mx-auto text-red-600 mb-4" size={64} />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-gray-600">Coach ID: {coachId}</p>
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                🔍 Debug Information
              </summary>
              <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono space-y-1 max-h-64 overflow-y-auto">
                {debugInfo.map((log, idx) => (
                  <div key={idx} className={log.includes('❌') ? 'text-red-600' : log.includes('✅') ? 'text-green-600' : 'text-gray-700'}>
                    {log}
                  </div>
                ))}
              </div>
            </details>

            <div className="mt-6 text-center">
              <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {coachInfo?.firstName?.[0]}{coachInfo?.lastName?.[0]}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join {coachInfo?.displayName} Coaching
          </h1>
          <p className="text-gray-600">Create your account to start your coaching journey</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">What you'll get:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm text-gray-700">Personalized coaching sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm text-gray-700">Goal tracking and progress monitoring</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm text-gray-700">Direct messaging with your coach</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <span className="text-sm text-gray-700">Access to coaching tools and resources</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input 
                type="password" 
                required 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                placeholder="Min 6 characters" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input 
                type="password" 
                required 
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account...' : 'Create Account & Start Coaching'}
          </button>
        </form>
      </div>
    </div>
  );
}
