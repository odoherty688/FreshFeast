import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import { AlertColor, Backdrop, Box, Button, Card, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import theme from '../components/Theme';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckboxGroup from '../components/CheckboxGroup';
import { allergyLabels, allergyValues, dietLabels, dietValues, signupText } from '../text/signupText';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import AlertPopup from '../components/Alert';

const UserInformation = () => {
    const {getAccessTokenSilently, user} = useAuth0()
    const userContext = useContext(UserContext);
    const [accessToken, setAccessToken] = useState<string>("");
    const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
    const [saveBackdropOpen, setSaveBackdropOpen] = useState<boolean>(false);
    const [selectedDiets, setSelectedDiets] = useState<Array<string>>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<Array<string>>([]);
    const [userDiets, setUserDiets] = useState<Array<string>>([]);
    const [userAllergies, setUserAllergies] = useState<Array<string>>([]);
    const [submit, setSubmit] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);


    useEffect(() => {
        const fetchAccessToken = async () => {
          try {
            const accessToken = await getAccessTokenSilently();
            setAccessToken(accessToken)
    
          } catch (error) {
            console.error(error);
          }
        };
        
        fetchAccessToken();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (userContext && userContext.activeUser) {
            const activeUser = userContext.activeUser;
            setSelectedAllergies(activeUser.allergies)
            setSelectedDiets(activeUser.diet);
            setUserDiets(activeUser.diet)
            setUserAllergies(activeUser.allergies)
        }
    }, [user, userContext])

    const handleBackdrop = () => {
        setBackdropOpen(!backdropOpen)

        if (submit === false && userContext) {
            const activeUser = userContext.activeUser;
            setSelectedAllergies(activeUser.allergies)
            setSelectedDiets(activeUser.diet);
        }
    }

    const handleSaveBackdrop = () => {
        setSaveBackdropOpen(!saveBackdropOpen)
    }

    const savePreferences = async () => {
        try {
            if (user) {
                const userInfo = {
                    id: 0,
                    email: user.email,
                    picture: user.picture,
                    diet: selectedDiets,
                    allergies: selectedAllergies
                }

                const object = JSON.stringify(userInfo)
                console.log(object)
                const response = await axios.put('http://localhost:8000/api/users/editUser', object, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${accessToken}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    }
                });

                console.log("savePreferences", response)
                if (response.status === 200) {
                    setSubmit(true)
                    handleBackdrop();
                    localStorage.setItem("activeUser", JSON.stringify(userInfo))
                    setUserDiets(selectedDiets)
                    setUserAllergies(selectedAllergies)
                    setAlertOpen(true);
                    setAlertMessage(response.data.message);
                    setAlertSeverity('success');
                } else if (response.status === 400) {
                    setAlertOpen(true);
                    setAlertMessage('Could not save preferences');
                    setAlertSeverity('error');
                }
            }
        } catch (err) {
            setAlertOpen(true);
            setAlertMessage('Could not save preferences');
            setAlertSeverity('error');
        }
    }

    const SaveChangesBackdrop = () => {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: 3 }}
                open={saveBackdropOpen}
            >
                <Card sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'stretch', minWidth: 370, minHeight: 161 }}>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Are you sure you want to exit?</Typography>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>Note: Changes will not be saved</Typography>
                    </Box>
                    <Box sx={{padding: 2, display: 'flex', justifyContent: 'space-between'}}>
                        <Button variant="contained" data-testid='discard-changes-button' sx={{backgroundColor: theme.palette.info.main, color: {"&:hover": {backgroundColor: theme.palette.info.dark}}, marginRight: 1 }} onClick={() => { handleBackdrop(); handleSaveBackdrop(); }}>Discard Changes</Button>
                        <Button variant="contained" data-testid='cancel-button' sx={{backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.dark}}, marginLeft: 1}} onClick={() => { handleSaveBackdrop() }}>Cancel</Button>
                    </Box>
                </Card>
            </Backdrop>
        )
    }

    const BackdropCard = () => {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2, padding: 3 }}
                open={backdropOpen}
            >
                <Card sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 900, height: 700, minWidth: 900, minHeight: 700}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>Edit Preferences</Typography>
                        <Button data-testid='close-button' sx={{color: theme.palette.secondary.main }} onClick={() => handleSaveBackdrop()}>
                            <CloseOutlinedIcon />
                        </Button>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <CheckboxGroup title={signupText.diet} bio={signupText.dietBio} labels={dietLabels} values={dietValues} selectedLabels={selectedDiets} setSelectedLabels={setSelectedDiets} xs={2} md={2}/>
                        <CheckboxGroup title={signupText.allergies} bio={signupText.allergiesBio} labels={allergyLabels} values={allergyValues} selectedLabels={selectedAllergies} setSelectedLabels={setSelectedAllergies} xs={2} md={2}/>                    
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: "center", alignItems: "center", width: "100%", paddingTop: 1}}>
                        <Button variant="contained" data-testid='save-button' endIcon={<SaveOutlinedIcon />} sx={{backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.dark}}}} onClick={() => { savePreferences() }}>Save Changes</Button>
                    </Box>
                </Card>
                <SaveChangesBackdrop/>
            </Backdrop>
        )
    }

    if (userContext && userContext.activeUser) {
        const activeUser = userContext.activeUser;
       return (
        <Box>
            <Box sx={{padding: 3}}>
                <Card sx={{boxShadow: 6, padding: 2}}>
                    <Typography variant='body1' sx={{fontWeight: 'bold'}}>Your Account:</Typography>
                    <Box sx={{padding:1}}>
                        <Typography sx={{padding:1}} variant='body2'>Email: {activeUser.email}</Typography>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap:'5px'}}>
                            <Typography sx={{padding:1}} variant='body2'>Diet(s):</Typography>
                            {userDiets.map((dietLabel, index) => (
                                <Chip key={index} label={dietLabel} />
                            ))}
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap:'5px'}}>
                            <Typography sx={{padding:1}} variant='body2'>Health:</Typography>
                            {userAllergies.map((healthLabel, index) => (
                                <Chip key={index} label={healthLabel} />
                            ))}
                        </Stack>
                        <Box sx={{paddingTop: 2}}>
                            <Button data-testid='edit-preferences-button' variant="contained" endIcon={<EditOutlinedIcon />} sx={{backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.dark}}}} onClick={() => handleBackdrop()}>Edit Preferences</Button>
                        </Box>
                        <BackdropCard />
                    </Box>
                </Card>
            </Box>
            <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
        </Box>
        ) 
    } else {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
                <CircularProgress />
            </Box>
        )
    }
}

export default UserInformation;