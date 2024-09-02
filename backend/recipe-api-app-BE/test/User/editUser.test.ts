import database from '../../src/database';
import { editUser } from '../../src/api/User'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('editUser', () => {
    it('should edit user in the database', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          diet: ['vegetarian'],
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockResult = [
        { id: 1, email: 'test@example.com', picture: 'avatar.jpg', diet: 'vegetarian', allergies: 'nuts' }
      ];
  
      (database.query as jest.Mock).mockResolvedValueOnce([mockResult]);
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User Information Successfully updated in database.'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          email: 123, 
          diet: ['vegetarian'],
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured'
      });
    });
  
    it('should handle case when diet is not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          diet: 'vegetarian', 
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured'
      });
    });
  
    it('should handle case when allergies are not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          diet: ['vegetarian'],
          allergies: 123 
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured'
      });
    });
  
    it('should handle case when user is not found in the database', async () => {
      const req: any = {
        body: {
          email: 'nonexistent@example.com',
          diet: ['vegetarian'],
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([]);
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured'
      });
    });
  
    it('should handle case when there is an internal server error', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          diet: ['vegetarian'],
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await editUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured'
      });
    });
});
