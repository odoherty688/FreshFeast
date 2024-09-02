import database from '../../src/database';
import { getUser } from '../../src/api/User'

jest.mock('../../src/database', () => ({
    ...jest.requireActual('../../src/database'),
    query: jest.fn()
}));

describe('getUserInfo', () => {
  it('should return user information from the database', async () => {
    const req: any = { body: { email: 'test@example.com' } };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    const mockUser = { id: 1, email: 'test@example.com', picture: 'avatar.jpg', diet: 'paleo', allergies: 'dairy-free', completedRecipeCount: 5 };

    (database.query as jest.Mock).mockResolvedValue([[mockUser]]);


    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      userExists: true,
      userData: {
        id: mockUser.id,
        email: mockUser.email,
        picture: mockUser.picture,
        diet: ['paleo'], 
        allergies: ['dairy-free'], 
        completedRecipeCount: mockUser.completedRecipeCount
      }
    });
  });
  it('should handle case when email is missing in request body', async () => {
    const req: any = { body: {} }; 
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email is required in the request body'
    });
  });

  it('should handle case when user is not found in the database', async () => {
    const req: any = { body: { email: 'nonexistent@example.com' } };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockResolvedValue([[]]); 

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      userExists: false,
      userData: null
    });
  });

  it('should handle case when there is an internal server error', async () => {
    const req: any = { body: { email: 'test@example.com' } };
    const res: any = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    (database.query as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not get user data'
    });
  });
});

