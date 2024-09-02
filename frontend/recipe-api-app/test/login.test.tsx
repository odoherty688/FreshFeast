import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import LoginScreen from '../src/screens/Login';
import { mocked } from "jest-mock";

const user = {
   email: "johndoe@me.com",
   email_verified: true,
   sub: "google-oauth2|12345678901234",
};

jest.mock("@auth0/auth0-react");

const mockedUseAuth0 = mocked(useAuth0);

describe('LoginScreen', () => {
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

  it('renders logo with alt attribute', () => {
    render(<LoginScreen />);
    
    // Ensure the logo is rendered
    const logoElement = screen.getByAltText('Logo');
    expect(logoElement).toBeInTheDocument();

    // Ensure the alt attribute is present
    expect(logoElement).toHaveAttribute('alt', 'Logo');
  });

  it('should call loginWithRedirect function when login button is clicked', () => {
    // Render the component
    render(<LoginScreen />);
    
    // Verify button existence
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();
  
    // Simulate a click on the login button
    fireEvent.click(loginButton);
    
    // Check if loginWithRedirect function is called
    console.log(mockAuthenticatedUser.loginWithRedirect);
    expect(mockAuthenticatedUser.loginWithRedirect).toHaveBeenCalled();
  });
});
