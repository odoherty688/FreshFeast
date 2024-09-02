import database from '../../src/database';
import { deleteUserCalendarEvents } from '../../src/api/Calendar'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('deleteUserCalendarEvents', () => {
    it('should delete all calendar events for a user', async () => {
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
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce(["result"]);
  
      await deleteUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: ["result"],
        message: 'Successfully deleted all user events'
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
  
      await deleteUserCalendarEvents(req, res);
  
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
  
      await deleteUserCalendarEvents(req, res);
  
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
  
      await deleteUserCalendarEvents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Could not remove user event'
      });
    });
  });
  