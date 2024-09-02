import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import SignupScreen from '../src/screens/Signup';
import { mocked } from "jest-mock";
import UserContext from '../src/context/UserContext';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import axios from 'axios';

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

describe('SignupScreen', () => {
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

  it('renders checkboxes for diets and allergies', () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }
    
    render(
      <UserContext.Provider value={userContext}>
        <SignupScreen />
      </UserContext.Provider>
    )

    // Ensure the diet checkboxes are rendered
    expect(screen.getByText('Diet')).toBeInTheDocument();
    expect(screen.getByText('Please Select Your Dietary Requirements:')).toBeInTheDocument();
    expect(screen.getByLabelText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByLabelText('Vegan')).toBeInTheDocument();
    // Add more assertions for other diet checkboxes

    // Ensure the allergy checkboxes are rendered
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Please Select Your Allergies:')).toBeInTheDocument();
    expect(screen.getByLabelText('Gluten')).toBeInTheDocument();
    expect(screen.getByLabelText('Dairy')).toBeInTheDocument();
    // Add more assertions for other allergy checkboxes
  });

  it('submits user information when submit button is clicked', async () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem')

    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const data = {
      status: 200,
      data: {
          message: "User successfully inserted into the database: johndoe@me.com",
        }
    }

    render(
      <UserContext.Provider value={userContext}>
        <SignupScreen />
      </UserContext.Provider>
    )

    // Simulate selecting diet and allergy checkboxes
    fireEvent.click(screen.getByLabelText('Vegetarian'));
    fireEvent.click(screen.getByLabelText('Gluten'));

    // Verify button existence and click it
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    mockedAxios.post.mockImplementationOnce(() => Promise.resolve(data));


    await waitFor(() => {
      expect(userContext.setActiveUser).toHaveBeenCalled();
    });  
    
    // Wait for API call to resolve
    await waitFor(() => {
      // Check if setActiveUser and localStorage.setItem are called
      expect(setItem).toHaveBeenCalled();
      // Add more assertions for API call and navigation if needed
    });

    await waitFor(() => {
      expect(mockUsedNavigate).toHaveBeenCalledWith('/')
    });

  });
});
