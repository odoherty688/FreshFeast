import database from '../../src/database';
import { addUserFavouritedRestaurant } from '../../src/api/Restaurants';

jest.mock('../../src/database', () => ({
  ...jest.requireActual('../../src/database'),
  query: jest.fn()
}));

describe('addUserFavouritedRestaurant', () => {
  it('should add a restaurant to user favourites', async () => {
    const req: any = {
      body: {
        userEmail: 'test@example.com',
        restaurantId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const mockUserId = 1;

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);

    (database.query as jest.Mock).mockResolvedValueOnce({});

    await addUserFavouritedRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      data: {},
      message: 'Successfully added restaurant to favourites'
    });
  });

  it('should handle case when email is not valid', async () => {
    const req: any = {
      body: {
        userEmail: 123,
        restaurantId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    await addUserFavouritedRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Email is not valid'
    });
  });

  it('should handle case when restaurant ID is not valid', async () => {
    const req: any = {
      body: {
        userEmail: 'test@example.com',
        restaurantId: 123
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    await addUserFavouritedRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Restaurant Id is not valid'
    });
  });

  it('should handle case when user ID not found', async () => {
    const req: any = {
      body: {
        userEmail: 'nonexistent@example.com',
        restaurantId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockResolvedValueOnce([[]]);

    await addUserFavouritedRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'User not found'
    });
  });

  it('should handle case when there is an internal server error', async () => {
    const req: any = {
      body: {
        userEmail: 'test@example.com',
        restaurantId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);

    (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await addUserFavouritedRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not add restaurant'
    });
  });
});
