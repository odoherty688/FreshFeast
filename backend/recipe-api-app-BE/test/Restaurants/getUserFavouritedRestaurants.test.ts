import database from '../../src/database';
import { getUserFavouritedRestaurants } from '../../src/api/Restaurants';

jest.mock('../../src/database', () => ({
  ...jest.requireActual('../../src/database'),
  query: jest.fn()
}));

describe('getUserFavouritedRestaurants', () => {
  it('should retrieve favourited restaurants for a user', async () => {
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
    const mockRestaurantIds = [1, 2, 3];

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);

    (database.query as jest.Mock).mockResolvedValueOnce([[{ restaurantId: 1 }, { restaurantId: 2 }, { restaurantId: 3 }]]);

    await getUserFavouritedRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      data: mockRestaurantIds,
      message: 'Successfully retrieved user favourited restaurants'
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

    await getUserFavouritedRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not add restaurant'
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

    await getUserFavouritedRestaurants(req, res);

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

    await getUserFavouritedRestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not add restaurant'
    });
  });
});
