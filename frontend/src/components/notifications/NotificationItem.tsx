'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Calendar, Target, MessageSquare } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const iconMap = {
  tool_assigned: Target,
  tool_completed: CheckCircle,
  session_scheduled: Calendar,
  goal_updated: Target,
  message_received: MessageSquare,
};

const colorMap = {
  tool_assigned: 'text-emerald-600 bg-emerald-100',
  tool_completed: 'text-green-600 bg-green-100',
  session_scheduled: 'text-purple-600 bg-purple-100',
  goal_updated: 'text-orange-600 bg-orange-100',
  message_received: 'text-indigo-600 bg-indigo-100',
};

export default function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotifications();

  const Icon = iconMap[notification.type] || AlertCircle;
  const colorClass = colorMap[notification.type] || 'text-gray-600 bg-gray-100';

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    onClose();
  };

  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-full" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
