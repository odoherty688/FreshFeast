import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import RecipeScreen from '../src/screens/Recipe';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import Restaurants from '../src/screens/Restaurants';
import { mockNavigatorGeolocation } from './mocks/mockGeolocation';
import { mockBackendFail, mockGetFavouritedRestaurants, mockGetNoFavouritedRestaurants, mockNoPlacesRestaurants, mockPlacesFail, mockPlacesRestaurant, mockPlacesRestaurants } from './mocks/mockBackendCalls';
import { Marker, initialize, mockInstances } from '@googlemaps/jest-mocks';

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

describe('RestaurantsScreen', () => {
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
    // initialize()
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('renders map and info', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Restaurants Near You')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Restaurant Info')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Favourites')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Click on a Restaurant to see Details')).toBeInTheDocument()
    })
  })

  it('displays favourite restaurants', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByTestId('favourites-button')).toBeInTheDocument()
    })

    const favouritesButton = screen.getByTestId('favourites-button')

    fireEvent.click(favouritesButton)

    await waitFor(() => {
        expect(screen.getByText('Your Favourite Restaurants')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Restaurant Test 1')).toBeInTheDocument()
    })
  })

  it('displays message that no restaurants are favourited', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockGetNoFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByTestId('favourites-button')).toBeInTheDocument()
    })

    const favouritesButton = screen.getByTestId('favourites-button')

    fireEvent.click(favouritesButton)

    await waitFor(() => {
        expect(screen.getByText('Your Favourite Restaurants')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('No Favourited Restaurants Yet!')).toBeInTheDocument()
    })
  })

  it('displays restaurant when pin button clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByTestId('favourites-button')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByTestId('restaurant-info-button')).toBeInTheDocument()
    })

    const favouritesButton = screen.getByTestId('favourites-button')
    const restaurantInfoButton = screen.getByTestId('restaurant-info-button')

    fireEvent.click(favouritesButton)

    await waitFor(() => {
        expect(screen.getByText('Your Favourite Restaurants')).toBeInTheDocument()
    })
    
    const restaurantPinButton = screen.getByTestId('restaurant-pin-button')

    await waitFor(() => {
        expect(restaurantPinButton).toBeInTheDocument()
    })

    fireEvent.click(restaurantPinButton)
    fireEvent.click(restaurantInfoButton)

    await waitFor(() => {
        expect(screen.getByText('Address:')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Address')).toBeInTheDocument()
    })
    
    await waitFor(() => {
        expect(screen.getByText('+44 12345678901')).toBeInTheDocument()
    })

    await waitFor(() => {
        expect(screen.getByText('Go To Website')).toBeInTheDocument()
    })
  })

  it('should display an error if cannot get favourites', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockBackendFail);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
        expect(screen.getByText('Could not get Favourites')).toBeInTheDocument()
    })
  })

  it('should display an error if cannot get restaurants in area', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.post.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.post.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.post.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.post.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesRestaurant);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug(undefined,Infinity)
    
    await waitFor(() => {
        expect(screen.getByText('Could not fetch restaurants')).toBeInTheDocument()
    })
  })

  it('should display an error if cannot get a restaurant', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
    }

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
          .mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
              latitude: 54.995800,
              longitude: -7.307400
            }
          })))
    };

    (global as any).navigator.geolocation = mockGeolocation;

    mockedAxios.post.mockResolvedValueOnce(mockPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.post.mockResolvedValueOnce(mockNoPlacesRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockGetFavouritedRestaurants);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesFail);
    mockedAxios.get.mockResolvedValueOnce(mockPlacesFail);

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Restaurants />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug(undefined,Infinity)
    
    await waitFor(() => {
        expect(screen.getByText('Could not get restaurant details')).toBeInTheDocument()
    })
  })
})