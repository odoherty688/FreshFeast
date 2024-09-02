import database from '../../src/database';
import { addUserCompletedRecipe } from '../../src/api/CompletedRecipes';

jest.mock('../../src/database', () => ({
  ...jest.requireActual('../../src/database'),
  query: jest.fn()
}));

describe('addUserCompletedRecipe', () => {
  it('should add completed recipe for a user', async () => {
    const req: any = {
      body: {
        userEmail: 'test@example.com',
        recipeId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const mockUserId = 1;

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: mockUserId }]]);

    (database.query as jest.Mock).mockResolvedValueOnce({});

    await addUserCompletedRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: false,
      data: {},
      message: 'Successfully added completed recipes'
    });
  });

  it('should handle case when email is not valid', async () => {
    const req: any = {
      body: {
        userEmail: 123,
        recipeId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    await addUserCompletedRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Email is not valid'
    });
  });

  it('should handle case when recipe ID is not valid', async () => {
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

    await addUserCompletedRecipe(req, res);

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
        recipeId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockResolvedValueOnce([[]]);

    await addUserCompletedRecipe(req, res);

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
        recipeId: '123'
      }
    };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);

    (database.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await addUserCompletedRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      data: null,
      message: 'Could not add completed recipe'
    });
  });
});
