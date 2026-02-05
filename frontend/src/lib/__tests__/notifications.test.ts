// Mock Firebase first before imports
jest.mock('../firebase', () => ({
  db: {},
}));

const mockCollectionRef = { _type: 'mock-collection-ref' };
const mockAddDoc = jest.fn((_ref: unknown, _data: unknown) => Promise.resolve({ id: 'mock-notification-id' }));
const mockCollection = jest.fn((_db: unknown, _path: string) => mockCollectionRef);
const mockServerTimestamp = jest.fn(() => 'mock-timestamp');

jest.mock('firebase/firestore', () => ({
  collection: (db: unknown, path: string) => mockCollection(db, path),
  addDoc: (ref: unknown, data: unknown) => mockAddDoc(ref, data),
  serverTimestamp: () => mockServerTimestamp(),
}));

// Import after mocks are set up
import { createNotification, notificationHelpers } from '../notifications';

describe('Notifications Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddDoc.mockClear();
    mockCollection.mockClear();
  });

  describe('createNotification', () => {
    it('should create a notification with required fields', async () => {
      const result = await createNotification({
        userId: 'user-123',
        type: 'session_scheduled',
        title: 'Test Title',
        message: 'Test message',
      });

      expect(mockCollection).toHaveBeenCalled();
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'user-123',
          type: 'session_scheduled',
          title: 'Test Title',
          message: 'Test message',
          read: false,
        })
      );
      expect(result).toBe('mock-notification-id');
    });

    it('should create a notification with optional data and actionUrl', async () => {
      await createNotification({
        userId: 'user-123',
        type: 'tool_assigned',
        title: 'Tool Assigned',
        message: 'You have a new tool',
        data: { toolId: 'tool-1' },
        actionUrl: '/tools/tool-1',
      });

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: { toolId: 'tool-1' },
          actionUrl: '/tools/tool-1',
        })
      );
    });

    it('should handle errors and throw', async () => {
      mockAddDoc.mockRejectedValueOnce(new Error('Firebase error'));

      await expect(
        createNotification({
          userId: 'user-123',
          type: 'session_scheduled',
          title: 'Test',
          message: 'Test',
        })
      ).rejects.toThrow('Firebase error');
    });
  });

  describe('notificationHelpers.sessionAgreementShared', () => {
    it('should create notification when coach shares session agreement', async () => {
      await notificationHelpers.sessionAgreementShared(
        'coachee-123',
        'Coach María',
        'session-456'
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'coachee-123',
          type: 'notes_shared',
          title: '📋 Acuerdo de Sesión Compartido',
          message: 'Coach María ha compartido contigo el acuerdo de la sesión.',
          actionUrl: '/sessions/session-456',
        })
      );
    });

    it('should return notification id', async () => {
      const result = await notificationHelpers.sessionAgreementShared(
        'coachee-123',
        'Coach Juan',
        'session-789'
      );

      expect(result).toBe('mock-notification-id');
    });
  });

  describe('notificationHelpers.sessionReportShared', () => {
    it('should create notification when coach shares session report', async () => {
      await notificationHelpers.sessionReportShared(
        'coachee-456',
        'Coach Pedro',
        'session-123'
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'coachee-456',
          type: 'notes_shared',
          title: '📊 Informe de Sesión Compartido',
          message: 'Coach Pedro ha compartido contigo el informe de la sesión.',
          actionUrl: '/sessions/session-123',
        })
      );
    });

    it('should return notification id', async () => {
      const result = await notificationHelpers.sessionReportShared(
        'coachee-456',
        'Coach Ana',
        'session-999'
      );

      expect(result).toBe('mock-notification-id');
    });
  });

  describe('notificationHelpers - existing functions', () => {
    it('toolAssigned should create correct notification', async () => {
      await notificationHelpers.toolAssigned(
        'coachee-1',
        'Coach Test',
        'Wheel of Life',
        'wheel-of-life'
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'coachee-1',
          type: 'tool_assigned',
          title: 'New Tool Assigned',
          message: 'Coach Test assigned you "Wheel of Life"',
          actionUrl: '/tools/wheel-of-life',
        })
      );
    });

    it('sessionConfirmationRequired should create correct notification', async () => {
      await notificationHelpers.sessionConfirmationRequired(
        'coachee-1',
        'Coach María',
        '15 de Enero, 2026',
        'session-1'
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'coachee-1',
          type: 'session_scheduled',
          title: '📅 Nueva Sesión Programada',
          message: expect.stringContaining('Coach María'),
          actionUrl: '/sessions/session-1',
        })
      );
    });

    it('sessionCancelled should create correct notification', async () => {
      await notificationHelpers.sessionCancelled(
        'user-1',
        'Coach Juan',
        'Conflicto de agenda',
        'session-2',
        false // isCoach = false means recipient is coach
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: 'user-1',
          type: 'session_scheduled',
          title: '🚫 Sesión Cancelada',
          message: expect.stringContaining('Conflicto de agenda'),
        })
      );
    });

    it('sessionRescheduleRequested should create correct notification', async () => {
      await notificationHelpers.sessionRescheduleRequested(
        'user-1',
        'Coachee Ana',
        '20 de Febrero',
        'session-3',
        true // isCoach = true means recipient is coachee
      );

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          type: 'session_scheduled',
          title: '📅 Solicitud de Reprogramación',
          message: expect.stringContaining('20 de Febrero'),
        })
      );
    });
  });
});
