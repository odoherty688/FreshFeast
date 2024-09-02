import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import Home from '../src/screens/Home';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import { mockRecipeFail, mockRecipeList, mockRecipe } from './mocks/mockRecipeList';
import { mockBackendFail, mockGetUserCompletedRecipeCount } from './mocks/mockBackendCalls';

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
 
 const mockedAxios = axios as jest.Mocked<typeof axios>;
 const mockedUseAuth0 = mocked(useAuth0);

describe('Home', () => {
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
          <Home />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('renders recommended recipes when data is loaded', async () => {

  mockedAxios.get.mockResolvedValueOnce(mockRecipeList)

  mockedAxios.get.mockResolvedValueOnce(mockRecipe)

  mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount)

    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Home />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Recommended Recipes For You')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByAltText('Test Recipe 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByAltText('Test Recipe 2')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByAltText('Test Recipe 3')).toBeInTheDocument();
    });
  });

  it('renders error state if user count data cannot be loaded', async () => {

    mockedAxios.get.mockResolvedValueOnce(mockRecipeList)

    mockedAxios.get.mockResolvedValueOnce(mockRecipe)
  
    mockedAxios.get.mockResolvedValueOnce(mockBackendFail)
    

    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Home />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Could not get recipe count')).toBeInTheDocument();
    })
  });

  it('renders error state if recipe of the day cannot be loaded', async () => {
    
    mockedAxios.get.mockResolvedValueOnce(mockRecipeList)

    mockedAxios.get.mockResolvedValueOnce(mockRecipeFail)

    mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount)


    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Home />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Could not get recipes')).toBeInTheDocument();
    })
  });

  it('renders error state if recipe list cannot be loaded', async () => {
    
    mockedAxios.get.mockResolvedValueOnce(mockRecipeFail)

    mockedAxios.get.mockResolvedValueOnce(mockRecipe)

    mockedAxios.get.mockResolvedValueOnce(mockGetUserCompletedRecipeCount)


    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Home />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Could not get recipes')).toBeInTheDocument();
    })
  });

});
