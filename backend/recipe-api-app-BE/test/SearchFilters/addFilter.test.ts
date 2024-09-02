import database from '../../src/database';
import { addFilter } from '../../src/api/SearchFilters'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('addFilter', () => {
    it('should add a filter successfully', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          filterName: 'Test Filter',
          diet: ['vegetarian'],
          allergies: ['nuts'],
          cuisineType: 'Italian',
          mealType: 'Lunch',
          dishType: 'Pasta'
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      const mockUserId = 1;
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);

      (database.query as jest.Mock).mockResolvedValueOnce(undefined);
  
      await addFilter(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: null,
        message: 'Filter added successfully'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          email: 123, 
          filterName: 'Test Filter',
          diet: ['vegetarian'],
          allergies: ['nuts']
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await addFilter(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
      });
    });
  
    it('should handle case when email is missing', async () => {
        const req: any = {
        body: {
            filterName: 'Test Filter',
            diet: ['vegetarian'],
            allergies: ['nuts']
        }
        };
        const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
        };
    
        await addFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Email is not valid'
        });
    });
    
    it('should handle case when filter name is missing', async () => {
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
    
        await addFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Filter Name is required'
        });
    });
    
    it('should handle case when diet is not an array of strings', async () => {
        const req: any = {
        body: {
            email: 'test@example.com',
            filterName: 'Test Filter',
            diet: 'vegetarian', 
            allergies: ['nuts']
        }
        };
        const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
        };
    
        await addFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
        error: true,
        data: null,
        message: 'Diet must be an array of strings'
        });
    });
});
  