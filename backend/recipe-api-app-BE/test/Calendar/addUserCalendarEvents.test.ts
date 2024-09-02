import database from '../../src/database';
import { addUserCalendarEvents } from '../../src/api/Calendar'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('addUserCalendarEvents', () => {
    it('should add calendar events for a user', async () => {
      const req: any = {
        body: [
          {
            userEmail: 'test@example.com',
            resourceId: 1,
            recipeId: 'recipe123',
            start: '2024-04-08T10:00:00',
            end: '2024-04-08T12:00:00',
            isDraggable: true,
            isResizable: true
          }
        ]
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockUserId = 1;
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce(undefined);
  
      await addUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Successfully saved calendar events in database'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: [
          {
            userEmail: 123, 
            resourceId: 1,
            recipeId: 'recipe123',
            start: '2024-04-08T10:00:00',
            end: '2024-04-08T12:00:00',
            isDraggable: true,
            isResizable: true
          }
        ]
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
      });
    });
    
    it('should handle case when user is not found in the database', async () => {
      const req: any = {
        body: [
          {
            userEmail: 'nonexistent@example.com',
            resourceId: 1,
            recipeId: 'recipe123',
            start: '2024-04-08T10:00:00',
            end: '2024-04-08T12:00:00',
            isDraggable: true,
            isResizable: true
          }
        ]
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([[]]);
  
      await addUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'User not found'
      });
    });
  
    it('should handle case when there is an internal server error', async () => {
      const req: any = {
        body: [
          {
            userEmail: 'test@example.com',
            resourceId: 1,
            recipeId: 'recipe123',
            start: '2024-04-08T10:00:00',
            end: '2024-04-08T12:00:00',
            isDraggable: true,
            isResizable: true
          }
        ]
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await addUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Could not add user event'
      });
    });
  });
  