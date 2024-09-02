import database from '../../src/database';
import { getUserFavouritedRecipes } from '../../src/api/Favourites'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('getUserFavouritedRecipes', () => {
    it('should retrieve favourited recipes for a user', async () => {
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
      const mockRecipeIds = [1, 2, 3];
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ recipeId: 1 }, { recipeId: 2 }, { recipeId: 3 }]]);
  
      await getUserFavouritedRecipes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: mockRecipeIds,
        message: 'Successfully retrieved user favourited recipes'
      });
    });
  
    it('should handle case when email is missing', async () => {
      const req: any = {
        params: {}
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await getUserFavouritedRecipes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Missing Email'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        params: {
          email: "Invalid email"
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await getUserFavouritedRecipes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
      });
    });
  
    it('should handle case when user ID not found', async () => {
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
  
      await getUserFavouritedRecipes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'User ID not found'
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
  
      await getUserFavouritedRecipes(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Could not get user favourited recipes'
      });
    });
  });
  