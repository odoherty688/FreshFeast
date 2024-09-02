import database from '../../src/database';
import { addUser } from '../../src/api/User'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('addUser', () => {
    it('should add user to the database', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 'avatar.jpg',
          diet: ['vegetarian'],
          allergies: ['nuts'],
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce(undefined);
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `User successfully inserted into the database: ${req.body.email} `
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          email: 123, 
          picture: 'avatar.jpg',
          diet: ['vegetarian'],
          allergies: ['nuts'],
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email is not valid'
      });
    });
  
    it('should handle case when picture is not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 123, 
          diet: ['vegetarian'],
          allergies: ['nuts'],
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Picture is not valid'
      });
    });
  
    it('should handle case when diet is not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 'avatar.jpg',
          diet: 'vegetarian', 
          allergies: ['nuts'],
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Diet is not valid'
      });
    });
  
    it('should handle case when allergies are not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 'avatar.jpg',
          diet: ['vegetarian'],
          allergies: 123, 
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Allergies are not valid'
      });
    });
  
    it('should handle case when completed recipe count is not valid', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 'avatar.jpg',
          diet: ['vegetarian'],
          allergies: ['nuts'],
          completedRecipeCount: '5' 
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Completed recipe count not valid'
      });
    });
  
    it('should handle case when there is an internal server error', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          picture: 'avatar.jpg',
          diet: ['vegetarian'],
          allergies: ['nuts'],
          completedRecipeCount: 5
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await addUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });
  