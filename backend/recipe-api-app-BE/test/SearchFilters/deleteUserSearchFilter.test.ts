import database from '../../src/database';
import { deleteUserSearchFilter } from '../../src/api/SearchFilters'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('deleteUserSearchFilter', () => {
    it('should successfully delete the filter', async () => {
      const req: any = {
        body: {
          email: 'test@example.com',
          filterId: 1
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      (database.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);

      (database.query as jest.Mock).mockResolvedValueOnce(["result"]);
  
      await deleteUserSearchFilter(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        data: ["result"],
        message: 'Successfully deleted filter'
      });
    });
  
    it('should handle case when email is not valid', async () => {
      const req: any = {
        body: {
          email: 'invalidemail', 
          filterId: 1
        }
      };
      const res: any = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
  
      await deleteUserSearchFilter(req, res);
  
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
            filterId: 1
          }
        };
        const res: any = {
          status: jest.fn(() => res),
          json: jest.fn()
        };
    
        await deleteUserSearchFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          error: true,
          data: null,
          message: 'Email is not valid'
        });
      });
    
      it('should handle case when filterId is missing', async () => {
        const req: any = {
          body: {
            email: 'test@example.com',
          }
        };
        const res: any = {
          status: jest.fn(() => res),
          json: jest.fn()
        };
    
        await deleteUserSearchFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          error: true,
          data: null,
          message: 'Filter ID is not valid'
        });
      });
    
      it('should handle case when filterId is not a number', async () => {
        const req: any = {
          body: {
            email: 'test@example.com',
            filterId: 'notANumber'
          }
        };
        const res: any = {
          status: jest.fn(() => res),
          json: jest.fn()
        };
    
        await deleteUserSearchFilter(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          error: true,
          data: null,
          message: 'Filter ID is not valid'
        });
      });
});
  