import { AlertColor, Box, Button, Card, CircularProgress, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import theme from '../components/Theme';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { UserRecipe } from '../interfaces/RecipeInterfaces';
import addRecipeToFavourites from '../api/Recipe/addRecipeToFavourites';
import deleteRecipeFromFavourites from '../api/Recipe/deleteRecipeFromFavourites';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import UserContext from '../context/UserContext';
import AlertPopup from '../components/Alert';
import retrieveUserInfo from '../components/User/retrieveUserInfo';

const RecipeScreen = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const userContext = useContext(UserContext)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const recipeId = params.get('recipeId');
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [recipe, setRecipe] = useState<any>()
  const [favouritedRecipes, setFavouritedRecipes] = useState<string[]>([]);
  const [favourited, setFavourited] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false)
  const [completedRecipeIds, setCompletedRecipeIds] = useState<string[]>([])
  const [accessToken, setAccessToken] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [completedRecipeCount, setCompletedRecipeCount] = useState<number | null>(null)

  useEffect(() => {
    fetchRecipeInfo()
  }, [getAccessTokenSilently])

  useEffect(() => {
    const getUserCompletedRecipeCount = async () => {
      try {
        if (user && user.email) {
          const accessToken = await getAccessTokenSilently()
  
          const currentUser = await retrieveUserInfo(user.email, accessToken)
  
          if(currentUser !== null) {
            setCompletedRecipeCount(currentUser.completedRecipeCount)
          } 
  
        }
      } catch (err) {
        if (alertOpen === false) {
          setAlertOpen(true);
          setAlertMessage('Error: Could not get completed recipe count');
          setAlertSeverity('error');
        }      
      }
    }

    getUserCompletedRecipeCount()
  }, [getAccessTokenSilently, user])

  useEffect(() => {
    const fetchFavouritedRecipes = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          setAccessToken(accessToken);

          if (user && user.email) {
            const userEmail = user.email
  
            const result = await axios.get(`http://localhost:8000/api/recipes/getUserFavouritedRecipes/${encodeURIComponent(userEmail)}`, {
              headers: {
                "Authorization": `bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
              },
            });
  
            if (result.data.error === false) {
              setFavouritedRecipes(result.data.data);
            } else {
              if (alertOpen === false) {
                setAlertOpen(true);
                setAlertMessage('Error: Could not get recipe');
                setAlertSeverity('error');
              }
            }
          }
        } catch (error) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not get recipe');
            setAlertSeverity('error');
          }
        }
      };

      const fetchCompletedRecipes = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          setAccessToken(accessToken);

          if (user && user.email) {
            const userEmail = user.email
  
            const result = await axios.get(`http://localhost:8000/api/completedRecipes/getUserCompletedRecipes/${encodeURIComponent(userEmail)}`, {
              headers: {
                "Authorization": `bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
              },
            });
  

            if (result.data.error === false) {
              let completedRecipeIds = result.data.data;
              
              if(recipeId !== null && completedRecipeIds.includes(recipeId)) {
                setComplete(true)
              }
            } else {
              if (alertOpen === false) {
                setAlertOpen(true);
                setAlertMessage('Error: Could not get completed recipes');
                setAlertSeverity('error');
              }            
            }
            
          }
        } catch (error) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not get completed recipes');
            setAlertSeverity('error');
          }        
        }
      }
    fetchCompletedRecipes()
    fetchFavouritedRecipes()
  }, []);

  useEffect(() => {
    if (recipeId !== null && favouritedRecipes.includes(recipeId)) {
        setFavourited(true)
    }
  }, [favouritedRecipes, recipeId])

  const fetchRecipeInfo = async () => {
    try {
        const url = edamamAPIEndpoints.baseUrl + `/${recipeId}` + edamamAPIEndpoints.edamamParameters

        const response = await axios.get(`${url}`)
        
        if (response.status === 200) {
          const returnedRecipe = response.data.recipe
          setRecipe(returnedRecipe)
          setLoading(false)
        } else if (response.status === 400) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not get recipe info');
            setAlertSeverity('error');
          }
        }

    } catch (err) {
        console.log(err)
        setLoading(false)
        setError(true)
        if (alertOpen === false) {
          setAlertOpen(true);
          setAlertMessage('Error: Could not get recipe info');
          setAlertSeverity('error');
        }
    }
  }

  const updateCompletedRecipeScore = async (updatedRecipeCount: number) => {
    try {
      if (user && user.email) {
        const userEmail = user.email
        
        const userInfo = {
          email: user.email,
          completedRecipeCount: updatedRecipeCount
        } 

        const response = await axios.put('http://localhost:8000/api/users/updateUserCompletedRecipeCount', userInfo, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${accessToken}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }
        });

        if (response.data.error === true) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Could not update completed recipe count');
            setAlertSeverity('error');
          }
        } 
      }
    } catch (err) {
      console.log(err)
      if (alertOpen === false) {
        setAlertOpen(true);
        setAlertMessage('Could not update completed recipe count');
        setAlertSeverity('error');
      }
    }
  }

  const addRecipeToCompletedRecipes = async () => {
    try {
      if(user && user.email && recipeId !== null) {
        const data: UserRecipe = {
          userEmail: user.email,
          recipeId: recipeId
        }  

        const result = await axios.post(`http://localhost:8000/api/completedRecipes/addUserCompletedRecipe`, data, {
          headers: {
          "Authorization": `bearer ${accessToken}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          },
          });

       if (result.data.error === true) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not add completed recipe');
            setAlertSeverity('error');
          }
        }
      } 
    } catch (err) {
      console.error(err);
      if (alertOpen === false) {
        setAlertOpen(true);
        setAlertMessage('Error: Could not add completed recipe');
        setAlertSeverity('error');
      }
    }
  }

  const removeRecipeFromCompletedRecipes = async () => {
    try {
      if(user && user.email && recipeId !== null) {
        const data: UserRecipe = {
          userEmail: user.email,
          recipeId: recipeId
        }  

        const result = await axios.delete(`http://localhost:8000/api/completedRecipes/deleteUserCompletedRecipe`, {
          headers: {
          "Authorization": `bearer ${accessToken}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          },
          data: data
        });


        if (result.data.error === false) {
          console.log('removed')
        } else if (result.data.error === true) {
          if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not add completed recipe');
            setAlertSeverity('error');
          }
        }
      } 
    } catch (err) {
      console.error(err);
      if (alertOpen === false) {
        setAlertOpen(true);
        setAlertMessage('Error: Could not remove completed recipe');
        setAlertSeverity('error');
      }
    }
  }

  const favouriteRecipe = async () => {
    if (user && user.email && recipeId) {
        if (favourited === true) {
            deleteRecipeFromFavourites(accessToken, user.email, recipeId, alertOpen, setAlertOpen, setAlertMessage, setAlertSeverity);
            setFavourited(false)
        } else if (favourited === false) {
            addRecipeToFavourites(accessToken, user.email, recipeId, alertOpen, setAlertOpen, setAlertMessage, setAlertSeverity)
            setFavourited(true)
        }    
    }
  }

  const RecipeCompleteButton = () => {
    if (complete === false) {
      return (
        <Button data-testid='complete-button' variant="contained" onClick={handleUpdateScore} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.light}}}}>
            Mark as Complete&nbsp;
            <DoneIcon/>
        </Button>
      )
    } else {
      return (
        <Button data-testid='incomplete-button' variant="contained" onClick={handleUpdateScore} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.info.main, color: {"&:hover": {backgroundColor: theme.palette.info.light}}}}>
            Mark as Incomplete&nbsp;
            <CloseIcon/>
        </Button>
      )
    }
  }

  const handleUpdateScore = () => {
    if (user && user.email && recipeId && userContext && completedRecipeCount !== null) {
      if (complete === true) {
        updateCompletedRecipeScore(completedRecipeCount - 1)
        removeRecipeFromCompletedRecipes()
        setComplete(false)
      } else if (complete === false) {
        updateCompletedRecipeScore(completedRecipeCount + 1)
        addRecipeToCompletedRecipes()
        setComplete(true)
      }
    }
  }

  const RecipeDetails = () => {    
    function formatString(sentence: string[]): string {
        if (sentence.length > 1) {
            return sentence
              .map(word =>
                word
                  .split('/')
                  .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1))
                  .join('/')
              )
              .join(', ');
          } else if (sentence.length === 1) {
            return sentence[0]
              .split('/')
              .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1))
              .join('/');
          } else {
            return 'None'; // Handle the case where the array is empty
          }
    }

    function roundToDecimalPlaces(value: number): number {
        const factor = 10 ** 1;
        return Math.round(value * factor) / factor;
    }

    const ingredients: string[] = recipe.ingredientLines
    const cuisineType: string = formatString(recipe.cuisineType);;
    const mealType: string = formatString(recipe.mealType);
    const dishType: string = formatString(recipe.dishType);
    const calories: number = roundToDecimalPlaces(recipe.calories);
    const dietLabels: string[] = recipe.dietLabels
    const healthLabels: string[] = recipe.healthLabels
    const cautions: string = formatString(recipe.cautions);
    const co2EmissionsClass: string = recipe.co2EmissionsClass;
    const totalCO2Emissions: number = roundToDecimalPlaces(recipe.totalCO2Emissions)
    const recipeUrl: string = recipe.url

    const handleNavigate = () => {
        window.location.href = recipeUrl
    }

    return (
        <Box sx={{padding: 4}}>
            <Grid container spacing={2} columns={{ xs: 6, md: 12 }} sx={{direction: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                <Grid item key={0} xs={6} md={6} sx={{padding:2}}>
                    <Box >
                        <Card sx={{boxShadow: 6, height: 500, width: 500}}>
                            <CardMedia
                                data-testid='recipe-image'
                                component="img"
                                src={recipe.images.REGULAR.url}
                                alt={recipe.label}
                                sx={{height: 500, width: 500}}
                            />  
                        </Card>
                    </Box>
                    <Box sx={{padding: 4}}>
                        <Card data-testid='ingredients-card' sx={{boxShadow: 6, padding: 2}}>
                            <Typography variant='body1' sx={{fontWeight: 'bold'}}>Ingredients:</Typography>
                            <Box sx={{padding:1}}>
                                {ingredients.map((ingredientLine: string, index: number) => (
                                    <Typography data-testid={`ingredient-${index}`} sx={{padding:0.5}} key={index} variant='body2'>{ingredientLine}</Typography>
                                ))}
                            </Box>
                        </Card>
                    </Box>
                </Grid>

                <Grid item key={1} xs={6} md={6} sx={{padding:2}}>
                    <Box>
                        <Card data-testid='recipe-information-card' sx={{boxShadow: 6, padding: 2}}>
                            <Typography variant='body1' sx={{fontWeight: 'bold'}}>Description:</Typography>
                            <Box sx={{padding:1}}>
                                <Typography sx={{padding:1}} variant='body2'>Meal Type: {mealType}</Typography>
                                <Typography sx={{padding:1}} variant='body2'>Cuisine: {cuisineType}</Typography>
                                <Typography sx={{padding:1}} variant='body2'>Dish: {dishType}</Typography>
                                <Typography sx={{padding:1}} variant='body2'>Calories: {calories}</Typography>
                                <Typography sx={{padding:1}} variant='body2'>Total CO&nbsp;&sup2; Emissions: {totalCO2Emissions}kt</Typography>
                                <Typography sx={{padding:1}} variant='body2'>Cautions: {cautions}</Typography>
                                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap:'5px'}}>
                                    <Typography sx={{padding:1}} variant='body2'>Diet Labels:</Typography>
                                    {dietLabels.map((dietLabel, index) => (
                                        <Chip key={index} label={dietLabel} />
                                    ))}
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap:'5px'}}>
                                    <Typography sx={{padding:1}} variant='body2'>Health Labels:</Typography>
                                    {healthLabels.map((healthLabel, index) => (
                                        <Chip key={index} label={healthLabel} />
                                    ))}
                                </Stack>
                            </Box>
                        </Card>
                    </Box>
                    <Box sx={{paddingTop:4}}>
                        <Grid container spacing={2} columns={{ xs: 6, md: 12 }} sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <Grid item key={2} xs={6} md={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <Card data-testid='co2-card' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, padding: 2, height: 150, width: 120}}>
                                <Typography sx={{paddingBottom: 2}} variant='body1'>CO2 Grade:</Typography>
                                <Typography variant='h2'>{co2EmissionsClass}</Typography>
                            </Card>
                            </Grid>
                            <Grid item key={3} xs={6} md={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
                            <Button data-testid='full-recipe-card' variant="contained" onClick={handleNavigate} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 2, padding: 2, height: 150, width: 120, backgroundColor: theme.palette.secondary.main, color: {"&:hover": {backgroundColor: theme.palette.secondary.light}}}}>
                                Full Recipe
                                <OpenInBrowserIcon/>
                            </Button>
                            </Grid>
                        </Grid>
                        
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
  }

  const FavouriteButton = () => {
    return (
            <Button onClick={favouriteRecipe} className={'favourite-button'} data-testid="favourite-button" sx={{ color: theme.palette.secondary.main }}>
            { favourited === true ? (
                <FavoriteOutlinedIcon className='favourite-outline'/>
            ) : (
                <FavoriteBorderOutlinedIcon className='favourite-filled'/>
            )
            }
            </Button>
    )
  }
  
  if (loading === true) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
          <CircularProgress />
      </Box>
    )
  } else if (error === true) {
    return (
        <>
        <Typography variant='h3'>Error:</Typography>
        <Typography variant='h5'>Could not get recipe with ID: {recipeId}</Typography>
        </>
    )
  }

  return (
    <Box>
      <Box sx={{ padding: 4, paddingTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>{recipe.label}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: 1 }}>
            <Box sx={{marginRight: 1}}>
              <RecipeCompleteButton />
            </Box>
            <FavouriteButton />
          </Box>
        </Box>
        <RecipeDetails />
      </Box>
      <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen} />
    </Box>
  );
};

export default RecipeScreen;
