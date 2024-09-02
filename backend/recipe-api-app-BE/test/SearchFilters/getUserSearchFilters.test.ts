import database from '../../src/database';
import { getUserSearchFilters } from '../../src/api/SearchFilters';

jest.mock('../../src/database', () => ({
  ...jest.requireActual('../../src/database'),
  query: jest.fn()
}));

describe('getUserSearchFilters', () => {
  it('should retrieve user search filters successfully', async () => {
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
    const mockFilters = [
      {
        id: 1,
        userId: mockUserId,
        filterName: 'Test Filter',
        diet: 'Vegetarian, Vegan',
        allergies: 'Nuts, Gluten',
        cuisineType: 'Italian',
        mealType: 'Dinner',
        dishType: 'Main Course'
      }
    ];

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);

    (database.query as jest.Mock).mockResolvedValueOnce([mockFilters]);

    await getUserSearchFilters(req, res);

    const result = [
        {
          id: 1,
          userId: mockUserId,
          filterName: 'Test Filter',
          diet: ['Vegetarian', 'Vegan'],
          allergies: ['Nuts', 'Gluten'],
          cuisineType: 'Italian',
          mealType: 'Dinner',
          dishType: 'Main Course'
        }
      ];

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      data: result,
      message: 'Successfully retrieved filters'
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

    await getUserSearchFilters(req, res);

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
        email: 'invalidemail'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    await getUserSearchFilters(req, res);

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

    await getUserSearchFilters(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'User does not exist'
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

    await getUserSearchFilters(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not get user data'
    });
  });
});
