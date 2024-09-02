import database from '../../src/database';
import { getUserCalendarEvents } from '../../src/api/Calendar'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('getUserCalendarEvents', () => {
    it('should return calendar events for a user', async () => {
      const req: any = {
        params: {
          email: 'test@example.com'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockUserId = 1;
      const mockEvents = [
        {
          userId: mockUserId,
          resourceId: 1,
          recipeId: 1,
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00',
          isDraggable: true,
          isResizable: false
        }
      ];
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce([mockEvents]);
  
      await getUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: mockEvents,
        message: 'Successfully retrieved calendar events in database'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        params: {
          email: 'invalidemail' 
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await getUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
      });
    });
  
    it('should handle case when user is not found in the database', async () => {
      const req: any = {
        params: {
          email: 'nonexistent@example.com'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([[]]);
  
      await getUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'User not found'
      });
    });
  
    it('should handle case when there is an internal server error', async () => {
      const req: any = {
        params: {
          email: 'test@example.com'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await getUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Could not get user events'
      });
    });
  });
  