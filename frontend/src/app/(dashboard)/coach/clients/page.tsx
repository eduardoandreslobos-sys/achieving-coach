'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

const ALL_CLIENTS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    joinedDate: '2025-09-15',
    totalSessions: 12,
    progress: 75,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    status: 'active',
    joinedDate: '2025-10-01',
    totalSessions: 8,
    progress: 60,
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    status: 'active',
    joinedDate: '2025-10-20',
    totalSessions: 4,
    progress: 40,
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@example.com',
    status: 'active',
    joinedDate: '2025-08-10',
    totalSessions: 18,
    progress: 85,
  },
];

export default function ClientsListPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const filteredClients = ALL_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
            <div className="flex items-center gap-6">
              <Link href="/coach" className="text-gray-600 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/coach" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            My Clients
          </h2>
          <p className="text-gray-600">
            Manage and track all your coaching relationships
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sessions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-600">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(client.joinedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{client.totalSessions}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{client.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/coach/clients/${client.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No clients found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
