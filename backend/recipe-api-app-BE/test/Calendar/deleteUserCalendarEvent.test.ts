import database from '../../src/database';
import { deleteUserCalendarEvent, deleteUserCalendarEvents } from '../../src/api/Calendar'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('deleteUserCalendarEvent', () => {
    it('should delete a calendar event for a user', async () => {
      const req: any = {
        body: {
          userEmail: 'test@example.com',
          recipeId: 'recipe123',
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockUserId = 1;
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce(["result"]);
  
      await deleteUserCalendarEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: ["result"],
        message: 'Successfully removed event from user events'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          userEmail: 123, 
          recipeId: 'recipe123',
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await deleteUserCalendarEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
      });
    });
  
    it('should handle case when recipeId is not valid', async () => {
      const req: any = {
        body: {
          userEmail: 'test@example.com',
          recipeId: 123, 
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await deleteUserCalendarEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Recipe ID is not valid'
      });
    });
    
    it('should handle case when user ID not found', async () => {
      const req: any = {
        body: {
          userEmail: 'nonexistent@example.com',
          recipeId: 'recipe123',
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([[]]);
  
      await deleteUserCalendarEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'User ID not found'
      });
    });
  
    it('should handle case when there is an internal server error', async () => {
      const req: any = {
        body: {
          userEmail: 'test@example.com',
          recipeId: 'recipe123',
          start: '2024-04-08T10:00:00',
          end: '2024-04-08T12:00:00'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await deleteUserCalendarEvent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Could not remove event from user events'
      });
    });
  });
  