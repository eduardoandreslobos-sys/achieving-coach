'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/notifications');
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
              onClose={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleViewAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Notifications
          </button>
          <button
            onClick={() => {
              markAllAsRead();
              onClose();
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
}
