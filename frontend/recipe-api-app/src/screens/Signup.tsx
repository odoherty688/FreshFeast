import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Grid, Paper, Typography } from '@mui/material';
import logo from '../FreshFeast.png';
import SendIcon from '@mui/icons-material/Send';
import { allergyLabels, allergyValues, dietLabels, dietValues, signupText } from '../text/signupText';
import theme from '../components/Theme';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { UserInfo } from '../interfaces/UserInfo';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import CheckboxGroup from '../components/CheckboxGroup';

const SignupScreen = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [selectedDiets, setSelectedDiets] = useState<Array<string>>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<Array<string>>([]);
  const userContext = useContext(UserContext);

  if (userContext === null) {
    return
  }

  const { activeUser, setActiveUser } = userContext;

  const getAccessToken = async () => {
    try {
        const accessToken = await getAccessTokenSilently();
        return accessToken;
    } catch (err) {
        console.log(err)
    }
}

  const handleSubmit = async () => {
    try {
        const accessToken = await getAccessToken();
        console.log("In submit")
        if (user && user.email && user.picture) {
          console.log("In user check")
            const userInfo = {
                id: 0,
                email: user.email,
                picture: user.picture,
                diet: selectedDiets,
                allergies: selectedAllergies,
                completedRecipeCount: 0
            }

            setActiveUser(userInfo)
            localStorage.setItem("activeUser", JSON.stringify(userInfo))
            console.log(activeUser);

            const object = JSON.stringify(userInfo)
            console.log(object)
            const response = await axios.post('http://localhost:8000/api/users/addUser', object, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
            });

            console.log("response", response)
            if (response.status === 200) {
                navigate('/');
                console.log("Success", response.data)
            } else if (response.status === 400) {
                console.log("Failure", response)
            }
        }
        
    } catch (err) {
        console.log(err)
    }
  }

  console.log('Selected Diets: ', selectedDiets)
  console.log('Selected Allergies: ', selectedAllergies)

  return (
    <Container
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          flexGrow: 1, // Takes remaining space
        }}
      >
        <img src={logo} width={200} height={115} alt="logo" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: 3       
        }}
      >
        <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
          <Grid item xs={6} md={6}>
            <CheckboxGroup title={signupText.diet} bio={signupText.dietBio} labels={dietLabels} values={dietValues} selectedLabels={selectedDiets} setSelectedLabels={setSelectedDiets} xs={12} md={6}/>
          </Grid>
          <Grid item xs={6} md={6}>
            <CheckboxGroup title={signupText.allergies} bio={signupText.allergiesBio} labels={allergyLabels} values={allergyValues} selectedLabels={selectedAllergies} setSelectedLabels={setSelectedAllergies} xs={12} md={6}/>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'right' }}>
        <Button variant="contained" endIcon={<SendIcon />} sx={{backgroundColor: theme.palette.secondary.main}} onClick={() => handleSubmit()}>{signupText.submit}</Button>  
      </Box>

    </Container>
  );
};

export default SignupScreen;
