import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import RecipeScreen from '../src/screens/Recipe';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import { mockRecipeSingle } from './mocks/mockRecipeList';
import { mockGetFavourtiedRecipes, mockGetNotFavouritedRecipe, mockGetUserCompletedRecipeCount, mockGetUserInfo, mockGetUserNotCompletedRecipeCount, mockRecipeToCompleted, mockRecipeToFavourites, mockUpdateUserCompletedRecipeCount } from './mocks/mockBackendCalls';

const user = {
    email: "johndoe@me.com",
    email_verified: true,
    picture: 'google-profile-picture',
    sub: "google-oauth2|12345678901234",
 };
 
 const activeUser: UserInfo = {
  id: 1,
  email: 'johndoe@me.com',
  picture: 'google.pic',
  diet: ["alcohol-free", "pork-free"],
  allergies: ["egg-free"],
  completedRecipeCount: 0
}

 jest.mock("@auth0/auth0-react");
 jest.mock('axios');
 
 const mockUsedNavigate = jest.fn();
 jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
   useNavigate: () => mockUsedNavigate,
 }));
 
 const mockedAxios = axios as jest.Mocked<typeof axios>;
 const mockedUseAuth0 = mocked(useAuth0);

describe('RecipeScreen', () => {
  const mockGetAccessTokenSilently = jest.fn().mockResolvedValue('dummy-access-token');

  const mockAuthenticatedUser: Auth0ContextInterface<User> = {
    isAuthenticated: true,
    user,
    logout: jest.fn(),
    loginWithRedirect: jest.fn(),
    getAccessTokenWithPopup: jest.fn(),
    getAccessTokenSilently: mockGetAccessTokenSilently,
    getIdTokenClaims: jest.fn(),
    loginWithPopup: jest.fn(),
    isLoading: false,
    handleRedirectCallback: jest.fn(),
  };

  beforeEach(() => {
    mockedUseAuth0.mockReturnValue(mockAuthenticatedUser);
  });

  it('renders loading state initially', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <RecipeScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('renders error state if recipe ID is not provided', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
      render(
        <BrowserRouter>
          <UserContext.Provider value={userContext}>
            <RecipeScreen />
          </UserContext.Provider>
        </BrowserRouter>
      );

    await waitFor(() => {
      expect(screen.getByText('Could not get recipe with ID:')).toBeInTheDocument(); // Adjust the error message according to your logic
    });
  });

  it('renders recipe details if recipe ID is provided', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);
    mockedAxios.post.mockResolvedValueOnce(mockGetUserInfo);
    mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);

    const location = {
      ...window.location,
      href: 'http://localhost:4000/recipe?recipeId=1',
      search: '?recipeId=1',
    };

    Object.defineProperty(window, 'location', {
      writable: false,
      value: location,
    });

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <RecipeScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
    })
  });

  it('deletes recipe from favorites when favorite button is clicked', async () => {
    const userContext: UserContextProps = {
      activeUser,
      setActiveUser: jest.fn()
    }

    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);
    mockedAxios.post.mockResolvedValueOnce(mockGetUserInfo);
    mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.delete.mockResolvedValueOnce(mockRecipeToFavourites)

    const location = {
      ...window.location,
      href: 'http://localhost:4000/recipe?recipeId=1',
      search: '?recipeId=1',
    };

    Object.defineProperty(window, 'location', {
      writable: false,
      value: location,
    });

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <RecipeScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('favourite-button'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:8000/api/recipes/deleteUserFavouritedRecipe', expect.anything()
      );
    });

    });

    it('adds recipe to favourites when favorite button is clicked', async () => {
      const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
  
      mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);
      mockedAxios.post.mockResolvedValueOnce(mockGetUserInfo);
      mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount);
      mockedAxios.get.mockResolvedValueOnce(mockGetNotFavouritedRecipe);
      mockedAxios.post.mockResolvedValueOnce(mockRecipeToFavourites)
  
      const location = {
        ...window.location,
        href: 'http://localhost:4000/recipe?recipeId=1',
        search: '?recipeId=1',
      };
  
      Object.defineProperty(window, 'location', {
        writable: false,
        value: location,
      });
  
      render(
        <BrowserRouter>
          <UserContext.Provider value={userContext}>
            <RecipeScreen />
          </UserContext.Provider>
        </BrowserRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
      });
  
      fireEvent.click(screen.getByTestId('favourite-button'));

      console.log('Received URLs:');
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8000/api/recipes/addUserFavouritedRecipe', expect.anything(), expect.anything()
        );
      });
  
    });

    it('deletes recipe from completed recipes when completed button is clicked', async () => {
      const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
  
      mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);
      mockedAxios.post.mockResolvedValueOnce(mockGetUserInfo);
      mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount);
      mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
      mockedAxios.put.mockResolvedValueOnce(mockUpdateUserCompletedRecipeCount);
      mockedAxios.delete.mockResolvedValueOnce(mockRecipeToCompleted)
  
      const location = {
        ...window.location,
        href: 'http://localhost:4000/recipe?recipeId=1',
        search: '?recipeId=1',
      };
  
      Object.defineProperty(window, 'location', {
        writable: false,
        value: location,
      });
  
      render(
        <BrowserRouter>
          <UserContext.Provider value={userContext}>
            <RecipeScreen />
          </UserContext.Provider>
        </BrowserRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
      });
  
      fireEvent.click(screen.getByText('Mark as Incomplete'));
  
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(
          'http://localhost:8000/api/completedRecipes/deleteUserCompletedRecipe', expect.anything()
        );
      });
  
    });

    it('adds recipe to completed recipes when completed button is clicked', async () => {
      const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
  
      mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);
      mockedAxios.post.mockResolvedValueOnce(mockGetUserInfo);
      mockedAxios.get.mockResolvedValueOnce(mockGetUserNotCompletedRecipeCount);
      mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
      mockedAxios.put.mockResolvedValueOnce(mockUpdateUserCompletedRecipeCount);
      mockedAxios.post.mockResolvedValueOnce(mockRecipeToCompleted)
  
      const location = {
        ...window.location,
        href: 'http://localhost:4000/recipe?recipeId=1',
        search: '?recipeId=1',
      };
  
      Object.defineProperty(window, 'location', {
        writable: false,
        value: location,
      });
  
      render(
        <BrowserRouter>
          <UserContext.Provider value={userContext}>
            <RecipeScreen />
          </UserContext.Provider>
        </BrowserRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
      });
  
      fireEvent.click(screen.getByText('Mark as Complete'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8000/api/completedRecipes/addUserCompletedRecipe', expect.anything(), expect.anything()
        );
      });
  
    });
});

