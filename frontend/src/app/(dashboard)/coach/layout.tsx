import ProtectedRoute from '@/components/ProtectedRoute';
import CoachSidebar from '@/components/CoachSidebar';

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['coach']}>
      <div className="flex h-screen bg-gray-50">
        <CoachSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
