import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { UserData, UserInfo } from '../../interfaces/UserInfo';
import axios from 'axios';

const retrieveUserInfo = async ( userEmail: string, accessToken: string ) => {
    try {
        const object = JSON.stringify({email: userEmail})

        const response = await axios.post('http://localhost:8000/api/users/getUser', object, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
        });

        console.log('retrieveUserInfo: ', response)
        if (response.status === 200) {
            const userData: UserData = response.data
            const userInfo: UserInfo = userData.userData
            return userInfo;
        }
        
        return null

    } catch (err) {
        console.log(err)
        return null
    }
}

export default retrieveUserInfo;