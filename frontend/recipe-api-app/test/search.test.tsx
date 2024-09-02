import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Auth0ContextInterface, User, useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { mocked } from 'jest-mock';
import { UserContextProps, UserInfo } from '../src/interfaces/UserInfo';
import UserContext from '../src/context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import Search from '../src/screens/Search';
import { mockAddFilter, mockBackendFail, mockGetUserSearchFilters } from './mocks/mockBackendCalls';
import { mockNoRecipesFound, mockRecipeList } from './mocks/mockRecipeList';

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

  it('renders the search bar', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
      
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    const contentInput = screen.getByTestId('content-input');

    fireEvent.change(contentInput, {
        target: { value: "chicken" }
      });

    await waitFor(() => {
        expect(screen.getByDisplayValue('chicken')).toBeInTheDocument();
    });
      
  });

  it('shows list of searched recipes when search button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.get.mockResolvedValueOnce(mockRecipeList);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    const contentInput = screen.getByTestId('content-input');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(contentInput, {
        target: { value: "chicken" }
    });

    fireEvent.click(searchButton);

    await waitFor(() => {
        expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    });
  });

  it('displays that no recipes were found if no results are returned', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.get.mockResolvedValueOnce(mockNoRecipesFound);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    const contentInput = screen.getByTestId('content-input');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(contentInput, {
        target: { value: "chicken" }
    });

    fireEvent.click(searchButton);

    await waitFor(() => {
        expect(screen.getByText('No results found for the search:')).toBeInTheDocument();
    });
  });

  it('displays an error message if filters could not be fetched from the database', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockBackendFail);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Could not get Saved Filters')).toBeInTheDocument();
    });
  });

  it('opens the manage filters backdrop when the button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');


    await waitFor(() => {
      expect(screen.getByTestId('manage-filters-button')).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    await waitFor(() => {
        expect(screen.getByText('Edit Preferences')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('Balanced')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('Dairy')).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText('Cuisine Type')).toBeInTheDocument();
    });
  });

  it('saves a filter when name is typed in and the button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.post.mockResolvedValueOnce(mockAddFilter);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');

    await waitFor(() => {
      expect(manageFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    const saveFiltersButton = screen.getByTestId('save-filter-backdrop-button')

    await waitFor(() => {
        expect(saveFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(saveFiltersButton);

    const filterNameContentInput = screen.getByTestId('filter-name-content-input');
    const saveFilterButton = screen.getByTestId('save-filter-button');

    fireEvent.change(filterNameContentInput, {
        target: { value: "New Filter" }
    });

    fireEvent.click(saveFilterButton);

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:8000/api/searchFilters/addFilter', expect.anything(), expect.anything()
        );
      });
  });

  it('displays an error message when filter cannot be saved', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.post.mockResolvedValueOnce(mockBackendFail);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');

    await waitFor(() => {
      expect(manageFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    const saveFiltersButton = screen.getByTestId('save-filter-backdrop-button')

    await waitFor(() => {
        expect(saveFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(saveFiltersButton);

    const filterNameContentInput = screen.getByTestId('filter-name-content-input');
    const saveFilterButton = screen.getByTestId('save-filter-button');

    fireEvent.change(filterNameContentInput, {
        target: { value: "New Filter" }
    });

    fireEvent.click(saveFilterButton);

    await waitFor(() => {
        expect(screen.getByText('Could not save filter')).toBeInTheDocument();
    });
  });

  it('displays saved filter when view filters button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.post.mockResolvedValueOnce(mockAddFilter);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');

    await waitFor(() => {
      expect(manageFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    const viewFiltersButton = screen.getByTestId('view-filter-backdrop-button')

    await waitFor(() => {
        expect(viewFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(viewFiltersButton);

    await waitFor(() => {
        expect(screen.getByText('Test Filter 1')).toBeInTheDocument();
    });
  });

  it('deletes a filter from saved filters when button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.post.mockResolvedValueOnce(mockAddFilter);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');

    await waitFor(() => {
      expect(manageFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    const viewFiltersButton = screen.getByTestId('view-filter-backdrop-button')

    await waitFor(() => {
        expect(viewFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(viewFiltersButton);

    const deleteFilterButton = screen.getByTestId('delete-filter-button-0');

    await waitFor(() => {
        expect(deleteFilterButton).toBeInTheDocument();
    });

    fireEvent.click(deleteFilterButton);

    await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(
          'http://localhost:8000/api/searchFilters/deleteUserSearchFilter', expect.anything()
        );
    });
  });

  it('applies a filter when button is clicked', async () => {
    const userContext: UserContextProps = {
        activeUser,
        setActiveUser: jest.fn()
      }
    
    mockedAxios.get.mockResolvedValueOnce(mockGetUserSearchFilters);
    mockedAxios.post.mockResolvedValueOnce(mockAddFilter);
    
    render(
      <BrowserRouter>
        <UserContext.Provider value={userContext}>
          <Search />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const manageFiltersButton = screen.getByTestId('manage-filters-button');

    await waitFor(() => {
      expect(manageFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(manageFiltersButton);

    const viewFiltersButton = screen.getByTestId('view-filter-backdrop-button')

    await waitFor(() => {
        expect(viewFiltersButton).toBeInTheDocument();
    });

    fireEvent.click(viewFiltersButton);

    const applyFilterButton = screen.getByTestId('apply-filter-button-0');

    await waitFor(() => {
        expect(applyFilterButton).toBeInTheDocument();
    });

    fireEvent.click(applyFilterButton);
  });
})