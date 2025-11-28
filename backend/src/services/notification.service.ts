import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export type NotificationType = 
  | 'tool_assigned' 
  | 'tool_completed' 
  | 'session_scheduled' 
  | 'goal_updated'
  | 'message_received';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

export interface Notification extends CreateNotificationData {
  id: string;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  private db = getFirestore();

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<string> {
    const notificationRef = await this.db.collection('notifications').add({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      actionUrl: data.actionUrl || '',
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return notificationRef.id;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.db.collection('notifications').doc(notificationId).update({
      read: true,
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const snapshot = await this.db
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const snapshot = await this.db
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .count()
      .get();

    return snapshot.data().count;
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string, 
    limit = 20,
    includeRead = true
  ): Promise<Notification[]> {
    let query = this.db
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (!includeRead) {
      query = query.where('read', '==', false) as any;
    }

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Notification[];
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await this.db.collection('notifications').doc(notificationId).delete();
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<void> {
    const snapshot = await this.db
      .collection('notifications')
      .where('userId', '==', userId)
      .get();

    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
