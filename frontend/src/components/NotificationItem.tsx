'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '@/contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
}

export default function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const router = useRouter();
  const [timeAgo, setTimeAgo] = useState('');

  // Calculate time ago on client only to avoid hydration mismatch
  useEffect(() => {
    const calculateTimeAgo = () => {
      if (!notification.createdAt) return '';

      const date = notification.createdAt.toDate
        ? notification.createdAt.toDate()
        : new Date(notification.createdAt as any);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

      if (seconds < 60) return 'Just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
      return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    };

    setTimeAgo(calculateTimeAgo());
    const interval = setInterval(() => setTimeAgo(calculateTimeAgo()), 60000);
    return () => clearInterval(interval);
  }, [notification.createdAt]);

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
        notification.actionUrl ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="flex items-start gap-3">
        {!notification.read && (
          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
        )}
        <div className={`flex-1 ${notification.read ? 'ml-5' : ''}`}>
          <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}
