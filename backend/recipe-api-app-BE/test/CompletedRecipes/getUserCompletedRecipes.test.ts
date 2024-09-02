import database from '../../src/database';
import { getUserCompletedRecipes } from '../../src/api/CompletedRecipes';

jest.mock('../../src/database', () => ({
  ...jest.requireActual('../../src/database'),
  query: jest.fn()
}));

describe('getUserCompletedRecipes', () => {
  it('should retrieve completed recipes for a user', async () => {
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

    await getUserCompletedRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      data: mockRecipeIds,
      message: 'Successfully retrieved completed recipes'
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

    await getUserCompletedRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not get completed recipes'
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

    await getUserCompletedRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not get completed recipes'
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

    await getUserCompletedRecipes(req, res);

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

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);

    (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await getUserCompletedRecipes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not get completed recipes'
    });
  });
});
