import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import RedirectScreen from '../src/screens/Redirect';
import auth0 from 'auth0-js';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import { mocked } from "jest-mock";
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';

// Mock useAuth0 hook
const user = {
    email: "johndoe@me.com",
    email_verified: true,
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

// Mock axios
jest.mock('axios');

const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockUsedNavigate,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseAuth0 = mocked(useAuth0);

describe('RedirectScreen', () => {
  const mockAuthenticatedUser: Auth0ContextInterface<User> = {
    isAuthenticated: true,
    user,
    logout: jest.fn(),
    loginWithRedirect: jest.fn(),
    getAccessTokenWithPopup: jest.fn(),
    getAccessTokenSilently: jest.fn(),
    getIdTokenClaims: jest.fn(),
    loginWithPopup: jest.fn(),
    isLoading: false,
    handleRedirectCallback: jest.fn(),
  };
  
  beforeEach(() => {
    mockedUseAuth0.mockReturnValue(mockAuthenticatedUser);
  });

  it('should render RedirectScreen when route matches /redirect', async () => {
    const userContext: UserContextProps = {
      activeUser,
      setActiveUser: jest.fn()
    } 
    
    render(
      <UserContext.Provider value={userContext}>
        <RedirectScreen />
      </UserContext.Provider>
    );
    
    // Assert that the "Redirecting" message is present
    expect(await screen.findByText('Redirecting')).toBeInTheDocument();
  });

  it('calls checkExistingUser and navigates to home if user exists', async () => {    
    const data = {
        status: 200,
        data: {
            userExists: true,
            userData: { id: 1, email: 'test@example.com' }
          }
    }

    const userContext: UserContextProps = {
      activeUser,
      setActiveUser: jest.fn()
    } 
    
    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(data));

    // const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce(data);

    console.log('Mocked axios.post: ', axios.post);

    render(
      <UserContext.Provider value={userContext}>
        <RedirectScreen />
      </UserContext.Provider>
    );

    // Wait for the checkExistingUser function to be called and resolved
    await waitFor(() => {
      expect(mockUsedNavigate).toHaveBeenCalledWith('/')
    });   

  });

  it('navigates to login if user does not exist', async () => {
    const data = {
      status: 200,
      data: {
        userExists: false,
        userData: null
      }
    };

    const userContext: UserContextProps = {
      activeUser,
      setActiveUser: jest.fn()
    } 

    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(data));

    // Render the RedirectScreen component
    render(
      <UserContext.Provider value={userContext}>
        <RedirectScreen />
      </UserContext.Provider>
    );

    // Wait for the checkExistingUser function to be called and resolved

    // Check if navigation to login is triggered
    await waitFor(() => {
      expect(mockUsedNavigate).toHaveBeenCalledWith('/signup')
    });
  });
});
