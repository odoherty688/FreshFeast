import database from '../../src/database';
import { deleteUserFavouritedRecipe } from '../../src/api/Favourites'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('deleteUserFavouritedRecipe', () => {
    it('should delete a recipe from user favourites', async () => {
      const req: any = {
        body: {
          userEmail: 'test@example.com',
          recipeId: 'recipe123'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockUserId = 1;
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);
  
      (database.query as jest.Mock).mockResolvedValueOnce(undefined);
  
      await deleteUserFavouritedRecipe(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: undefined,
        message: 'Successfully removed recipe from favourites'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          userEmail: 123, 
          recipeId: 'recipe123'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await deleteUserFavouritedRecipe(req, res);
  
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
          recipeId: 123 
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await deleteUserFavouritedRecipe(req, res);
  
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
          recipeId: 'recipe123'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([[]]);
  
      await deleteUserFavouritedRecipe(req, res);
  
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
          recipeId: 'recipe123'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
  
      await deleteUserFavouritedRecipe(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Could not remove recipe to favourites'
      });
    });
  });
  