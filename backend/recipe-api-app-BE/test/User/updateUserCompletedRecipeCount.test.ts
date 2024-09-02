import database from '../../src/database';
import { updateUserCompletedRecipeCount } from '../../src/api/User'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('addUser', () => {
    describe('updateUserCompletedRecipeCount', () => {
        it('should update user completed recipe count in the database', async () => {
          const req: any = {
            body: {
              email: 'test@example.com',
              completedRecipeCount: 10
            }
          };
          const res: any = {
            status: jest.fn(() => res),
            json: jest.fn()
          };
          const mockResult = [
            { id: 1, email: 'test@example.com', picture: 'avatar.jpg', diet: 'vegetarian', allergies: 'nuts', completedRecipeCount: 5 }
          ];
      
          (database.query as jest.Mock).mockResolvedValueOnce([mockResult]);
      
          await updateUserCompletedRecipeCount(req, res);
      
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: 'User Information Successfully updated in database.'
          });
        });
      
        it('should handle case when email is not valid', async () => {
          const req: any = {
            body: {
              email: 123, 
              completedRecipeCount: 10
            }
          };
          const res: any = {
            status: jest.fn(() => res),
            json: jest.fn()
          };
      
          await updateUserCompletedRecipeCount(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            error: 'An error occured'
          });
        });
      
        it('should handle case when completed recipe count is not valid', async () => {
          const req: any = {
            body: {
              email: 'test@example.com',
              completedRecipeCount: '10' 
            }
          };
          const res: any = {
            status: jest.fn(() => res),
            json: jest.fn()
          };
      
          await updateUserCompletedRecipeCount(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            error: 'An error occured'
          });
        });
      
        it('should handle case when user is not found in the database', async () => {
          const req: any = {
            body: {
              email: 'nonexistent@example.com',
              completedRecipeCount: 10
            }
          };
          const res: any = {
            status: jest.fn(() => res),
            json: jest.fn()
          };
      
          (database.query as jest.Mock).mockResolvedValueOnce([]);
      
          await updateUserCompletedRecipeCount(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            error: 'An error occured'
          });
        });
      
        it('should handle case when there is an internal server error', async () => {
          const req: any = {
            body: {
              email: 'test@example.com',
              completedRecipeCount: 10
            }
          };
          const res: any = {
            status: jest.fn(() => res),
            json: jest.fn()
          };
      
          (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
          await updateUserCompletedRecipeCount(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            error: 'An error occured'
          });
        });
      });
      
})