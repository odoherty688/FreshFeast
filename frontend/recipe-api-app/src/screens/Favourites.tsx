import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import { Box, Typography, CircularProgress, AlertColor } from '@mui/material';
import RecipeList from '../components/Recipe/RecipeList';
import AlertPopup from '../components/Alert';

const Favourites = () => {
    const {getAccessTokenSilently, user} = useAuth0()
    const userContext = useContext(UserContext);
    const [accessToken, setAccessToken] = useState<string>("")
    const [favouritedRecipeIds, setFavouritedRecipeIds] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<any>();
    const [recipeIds, setRecipeIds] = useState<string[]>([])
    const [loaded, setLoaded] = useState<boolean>(false)
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchFavouritedRecipes = async () => {
            try {
              const accessToken = await getAccessTokenSilently();
              setAccessToken(accessToken);
    
              if (user && user.email) {
                const userEmail = user.email
                console.log('userEmail: ', userEmail)
                console.log('TOKEN', accessToken)
      
                const result = await axios.get(`http://localhost:8000/api/recipes/getUserFavouritedRecipes/${encodeURIComponent(userEmail)}`, {
                  headers: {
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                  },
                });

                console.log(result)
      
                setFavouritedRecipeIds(result.data.data);
              }
            } catch (error) {
              console.error(error);
            }
          };
        fetchFavouritedRecipes()
    }, []);

    useEffect(() => {
        const fetchRecipe = async (recipeId: string) => {
            try {
                const url = edamamAPIEndpoints.baseUrl + `/${recipeId}` + edamamAPIEndpoints.edamamParameters;
                const response = await axios.get(`${url}`);
                return response.data.recipe;
            } catch (err) {
                console.log(err);
                return null; // Return null if an error occurs
            }
        };
    
        const fetchData = async () => {
            try {
                const fetchedRecipes = await Promise.all(favouritedRecipeIds.map(async (recipeId: string) => {
                    return await fetchRecipe(recipeId);
                }));
    
                const filteredRecipes = fetchedRecipes.filter(recipe => recipe !== null);
    
                const recipeIds = filteredRecipes.map(recipe => {
                    const match = recipe.uri.match(/_(\w+)$/);
                    return match && match[1];
                }).filter(id => id);
    
                setRecipeIds(recipeIds);
                setRecipes(filteredRecipes);
                setLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
    
        fetchData();
    }, [favouritedRecipeIds]);
    
    console.log("recipes", recipes)

    if (loaded === false) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'left', flexDirection: 'column', padding: 2 }}>
            <Box sx={{paddingLeft: 3}}>
                <Typography variant='h5'>Your Favourites:</Typography>
            </Box>
            { favouritedRecipeIds.length === 0 ? (
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', padding: 2, paddingTop: 10 }}>
                    <Typography variant='h6'>You currently have no favourited recipes!</Typography>
                    <Typography variant='h6'>Explore some on your Home Page!</Typography>
                </Box>
            ) : (
                <Box sx={{padding: 3}}>
                    <RecipeList recipes={recipes} recipeIds={recipeIds} favouritesList={true} accessToken={accessToken} favouritedRecipeIds={favouritedRecipeIds} alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity}/>
                </Box>
            )}
            <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
        </Box>
    )
};

export default Favourites;