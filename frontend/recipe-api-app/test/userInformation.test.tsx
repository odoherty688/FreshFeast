import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import Search from '../src/screens/Search';
import { mockAddFilter, mockBackendFail, mockGetUserSearchFilters, mockSavePreferences, mockSavePreferencesFail } from './mocks/mockBackendCalls';
import { mockNoRecipesFound, mockRecipeList } from './mocks/mockRecipeList';
import UserInformation from '../src/screens/UserInformation';

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

describe('SearchScreen', () => {
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
    render(
      <BrowserRouter>
        <UserContext.Provider value={null}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
  
  it('renders current user information', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Email: johndoe@me.com')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('alcohol-free')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('egg-free')).toBeInTheDocument();
    });
  });

  it('displays edit preferences backdrop when button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByText('Alcohol-free')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('Celery')).toBeInTheDocument();
    });
  });

  it('displays backdrop when close button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-button')

    fireEvent.click(closeButton)

    await waitFor(() => {
        expect(screen.getByText('Are you sure you want to exit?')).toBeInTheDocument();
    });
  });

  it('reverts to edit preferences backdrop once cancel button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-button')

    fireEvent.click(closeButton)

    await waitFor(() => {
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('cancel-button')

    fireEvent.click(cancelButton)

    await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
    });
  });

  it('reverts to main screen backdrop once discard changes button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-button')

    fireEvent.click(closeButton)

    await waitFor(() => {
        expect(screen.getByTestId('discard-changes-button')).toBeInTheDocument();
    });

    const discardChangesButton = screen.getByTestId('discard-changes-button')

    fireEvent.click(discardChangesButton)

    await waitFor(() => {
        expect(editPreferencesButton).toBeInTheDocument()
    });
  });

  it('saves changes made when the save changes button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.put.mockResolvedValueOnce(mockSavePreferences);
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByTestId('Celery-checkbox')).toBeInTheDocument();
    });

    const celeryCheckBox = screen.getByTestId('Celery-checkbox')

    fireEvent.click(celeryCheckBox)

    const saveChangesButton = screen.getByTestId('save-button')

    fireEvent.click(saveChangesButton)

    await waitFor(() => {
        expect(screen.getByText('celery-free')).toBeInTheDocument();
    });

  });

  it('displays an error when the backend returns an error', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }

    mockedAxios.put.mockResolvedValueOnce(mockSavePreferencesFail);
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <UserInformation />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-preferences-button')).toBeInTheDocument();
    });

    const editPreferencesButton = screen.getByTestId('edit-preferences-button')

    fireEvent.click(editPreferencesButton)

    await waitFor(() => {
        expect(screen.getByTestId('Celery-checkbox')).toBeInTheDocument();
    });

    const celeryCheckBox = screen.getByTestId('Celery-checkbox')

    fireEvent.click(celeryCheckBox)

    const saveChangesButton = screen.getByTestId('save-button')

    fireEvent.click(saveChangesButton)

    await waitFor(() => {
        expect(screen.getByText('Could not save preferences')).toBeInTheDocument();
    });

  });
});