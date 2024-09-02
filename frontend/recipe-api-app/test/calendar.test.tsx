import React from 'react';
import { fireEvent, getByTestId, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import CalendarScreen from '../src/screens/Calendar';
import { mockGetEvents, mockGetFavourtiedRecipes, mockNoEvents } from './mocks/mockBackendCalls';
import { mockRecipeSingle } from './mocks/mockRecipeList';
import userEvent from '@testing-library/user-event'

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

describe('CalendarScreen', () => {
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

  it('renders calendar initially', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('displays the user events', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.get.mockResolvedValueOnce(mockGetEvents);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        const event = screen.getByTestId('event-widget');
        expect(event).toBeInTheDocument()  
    });
  });

  it('displays the user favourited recipes', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.get.mockResolvedValueOnce(mockNoEvents);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        const recipes = screen.getAllByText('Test Recipe 1');
        expect(recipes.length).toBeGreaterThan(0);    
    });
  });

  it('displays the widget menu when the edit icon is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.get.mockResolvedValueOnce(mockGetEvents);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        const event = screen.getByTestId('event-widget');
        expect(event).toBeInTheDocument()  
    });

    const editButton = screen.getByTestId('event-edit-button');

    await waitFor(() => {
        expect(editButton).toBeInTheDocument()
    });
  });

  it('displays the ingredients when the view ingredients button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.get.mockResolvedValueOnce(mockGetEvents);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const ingredientsButton = screen.getByTestId('ingredients-button')

    await waitFor(() => {
      expect(ingredientsButton).toBeInTheDocument()  
    });

    fireEvent.click(ingredientsButton)

    await waitFor(() => {
        expect(screen.getByText('Ingredient A')).toBeInTheDocument()
    });
  });

  it('displays that there are no ingredients when the view ingredients button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.get.mockResolvedValueOnce(mockGetFavourtiedRecipes);
    mockedAxios.get.mockResolvedValueOnce(mockNoEvents);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeSingle);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <CalendarScreen />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const ingredientsButton = screen.getByTestId('ingredients-button')

    await waitFor(() => {
      expect(ingredientsButton).toBeInTheDocument()  
    });

    fireEvent.click(ingredientsButton)

    await waitFor(() => {
        expect(screen.getByText('Add recipes to your calendar to view ingredients!')).toBeInTheDocument()
    });
  });
});
