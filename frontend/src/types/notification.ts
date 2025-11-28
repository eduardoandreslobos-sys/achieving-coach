export type NotificationType = 
  | 'tool_assigned' 
  | 'tool_completed' 
  | 'session_scheduled' 
  | 'goal_updated'
  | 'message_received';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}
