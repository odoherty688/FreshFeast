import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useContext } from 'react';
import { UserData, UserExists } from '../interfaces/UserInfo';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const RedirectScreen = () => {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    if (userContext === null) {
      return
    }
  
    const { activeUser, setActiveUser } = userContext;

    const userEmail = user?.email;

    const getAccessToken = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            return accessToken;
        } catch (err) {
            console.log(err)
        }
    }

    const checkExistingUser = async () => {
        try {
            const accessToken = await getAccessToken();
            const object = JSON.stringify({email: userEmail})

            const response = await axios.post('http://localhost:8000/api/users/getUser', object, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            });

            if (response.status === 200) {
                const { userExists, userData }: UserData = response.data

                if (userExists === true) {
                    setActiveUser(userData);
                    navigate('/')
                } else {
                    navigate('/signup')
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    if (isAuthenticated) {
        checkExistingUser();

    }

    return (
        <div data-testid="redirect-screen">
            Redirecting
        </div>
    )
}

export default RedirectScreen