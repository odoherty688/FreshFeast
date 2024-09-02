/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { Container, CssBaseline } from '@mui/material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './screens/Home';
import Favourites from './screens/Favourites';
import LoginScreen from './screens/Login';
import { useAuth0 } from '@auth0/auth0-react';
import RedirectScreen from './screens/Redirect';
import SignupScreen from './screens/Signup';
import UserContext from './context/UserContext';
import { UserContextProps, UserInfo } from './interfaces/UserInfo';
import RecipeScreen from './screens/Recipe';
import Search from './screens/Search';
import UserInformation from './screens/UserInformation';
import CalendarScreen from './screens/Calendar';
import Restaurants from './screens/Restaurants';
import retrieveUserInfo from './components/User/retrieveUserInfo';

const App = () => {
  const location = useLocation(); // Get the current location
  const { isAuthenticated, user, getAccessTokenSilently  } = useAuth0();
  const navigate = useNavigate();

  const defaultUser: UserInfo = {
    id: 0,
    email: '',
    picture: '',
    diet: [],
    allergies: [],
    completedRecipeCount: 0
  }

  const [activeUser, setActiveUser] = useState<UserInfo>(defaultUser)

  const userContext: UserContextProps = {
    activeUser,
    setActiveUser
  }

  useEffect(() => {
    if (activeUser.email !== '') {
      localStorage.setItem("activeUser", JSON.stringify(activeUser))
    }
  }, [activeUser])

  useEffect(() => {
    let storedUser = localStorage.getItem("activeUser")

    if (storedUser !== null) {
      const parsedUser: UserInfo = JSON.parse(storedUser)
      if (!isAuthenticated && !hideNavBar && parsedUser.email === '') {
        navigate('/login');
      }
    } else if (!user && !isAuthenticated && !hideNavBar) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser !== null) {
      let parsedUser: UserInfo = JSON.parse(storedUser)
      const databaseUser = getUserInfo(parsedUser)

      if(databaseUser && databaseUser !== null) {
        if (parsedUser.email !== '') {
          setActiveUser(parsedUser);
        }
      }
    }
  }, [])

  const getUserInfo = async (parsedUser: UserInfo) => {
    try {
      if (user) {
        const accessToken = await getAccessTokenSilently()
        let result = await retrieveUserInfo(parsedUser.email, accessToken)

        return result;
      }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  const storedUser = localStorage.getItem('activeUser');
  
  console.log("StoredUser: ", storedUser)

  console.log('Active User: ', activeUser)

  const hideNavBar = location.pathname === '/login' || location.pathname === '/authorise' || location.pathname === '/signup' || location.pathname === '/redirect';

  return (
    <React.Fragment>
      <CssBaseline />
      {!hideNavBar && <NavBar />}
      <Container
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          marginTop: hideNavBar ? 0 : 15, // Adjust the value based on your NavBar height
        }}
      >
        <UserContext.Provider value={userContext}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/redirect" element={<RedirectScreen/>} />
          {isAuthenticated && (
            <>
            <Route path='/signup' element={<SignupScreen />} />
            {!hideNavBar && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/recipe" element={<RecipeScreen />} />
                <Route path="/search" element={<Search />} />
                <Route path="/user" element={<UserInformation />} />
                <Route path="/calendar" element={<CalendarScreen />} />
                <Route path="/restaurants" element={<Restaurants />} />
              </>
            )}
          </>
          )}
          
        </Routes>
        </UserContext.Provider>
      </Container>
    </React.Fragment>
  );
};

export default App;
