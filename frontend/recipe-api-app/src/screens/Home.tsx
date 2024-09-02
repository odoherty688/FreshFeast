import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { edamamAPIEndpoints } from '../api/edamamAPIEndpoints';
import UserContext from '../context/UserContext';
import { AlertColor, Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RecipeList from '../components/Recipe/RecipeList';
import recipeTest from '../config/RecipeTest'
import { rotdSearch } from '../text/signupText';
import AlertPopup from '../components/Alert';
import retrieveUserInfo from '../components/User/retrieveUserInfo';
import { UserInfo } from '../interfaces/UserInfo';

const Home = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tempUrl, setTempUrl] = useState('')
  const [completedRecipeCount, setCompletedRecipeCount] = useState<number | null>(null)
  const [recipes, setRecipes] = useState<any[]>([]);
  const [recipeIds, setRecipeIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>("");
  const userContext = useContext(UserContext);
  const [rotdRecipe, setRotdRecipe] = useState<any>();
  const [rotdRecipeLoaded, setRotdRecipeLoaded] = useState<boolean>(false);
  const [rotdRecipeId, setRotdRecipeId] = useState<string>("")
  const navigate = useNavigate();
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
    const fetchCompletedRecipes = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log(accessToken)
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
            
            setCompletedRecipeCount(completedRecipeIds.length)
          } else {
            if (alertOpen === false) {
              setAlertOpen(true);
              setAlertMessage('Error: Could not get recipe count');
              setAlertSeverity('error');
            }
          }
          
        }
      } catch (error) {
        if (alertOpen === false) {
          setAlertOpen(true);
          setAlertMessage('Error: Could not get recipe count');
          setAlertSeverity('error');
        }
      }
    }

    fetchCompletedRecipes()
  }, [getAccessTokenSilently, user])

  useEffect(() => {
    if (recipes.length === 0) {
      fetchRecipeInfo();
      fetchRecipeInfo(true)
    }
  }, [])

  const fetchRecipeInfo = async (rotd?: boolean) => {
      try {
          if (userContext !== null) {
              const activeUser = userContext.activeUser
              const diets = activeUser.diet
              const allergies = activeUser.allergies
              let allergiesString = ''
              let dietString = ''
              let url = ''

              diets.forEach((setting) => {
                  if (setting === "high-fiber" || setting === "high-protein" || setting === "low-carb" || setting === "low-fat" || setting === "low-sodium" ) {
                      dietString = dietString + `&diet=${setting}`
                  } else if (setting !== "balanced") {
                      allergiesString = allergiesString + `&health=${setting}`
                  }
              });

              allergies.forEach((setting) => {
                  if (setting === "high-fiber" || setting === "high-protein" || setting === "low-carb" || setting === "low-fat" || setting === "low-sodium" ) {
                      dietString = dietString + `&diet=${setting}`
                    } else if (setting !== "balanced") {
                      allergiesString = allergiesString + `&health=${setting}`
                  }
              });

              if(rotd) {
                const currentDayOfWeek = new Date().getDay();
                const chosenString = rotdSearch[currentDayOfWeek];

                url = edamamAPIEndpoints.baseUrl + edamamAPIEndpoints.edamamParameters + dietString + allergiesString + `&q=${chosenString}`;
              } else {
                url = edamamAPIEndpoints.baseUrl + edamamAPIEndpoints.edamamParameters + dietString + allergiesString + '&random=true';
              }

              setTempUrl(url)

              const response = await axios.get(`${url}`)

              console.log('rotd', response)
              if (response.status === 200) {
                if (rotd === true) {
                  const recipe = response.data.hits[0].recipe
                  const recipeUrl = recipe.uri
                  const match = recipeUrl.match(/_(\w+)$/);

                  if (match && match[1]) {
                    const extractedId = match[1];
                    setRotdRecipeId(extractedId);
                    setRotdRecipe(recipe)
                    setRotdRecipeLoaded(true)
                  } else {
                    if (alertOpen === false) {
                      setAlertOpen(true);
                      setAlertMessage('Error: Could not get recipes');
                      setAlertSeverity('error');
                    }                  }
                } else {
                  response.data.hits.forEach((hit: any) => {
                    const recipe = hit.recipe
                    setRecipes((prevRecipes: any) => [...prevRecipes, recipe]);
    
                    const recipeUrl = recipe.uri
                    const match = recipeUrl.match(/_(\w+)$/);
        
                    if (match && match[1]) {
                      const extractedId = match[1];
                      setRecipeIds((prevRecipeIds) => [...prevRecipeIds, extractedId]);
                    } else {
                      if (alertOpen === false) {
                        setAlertOpen(true);
                        setAlertMessage('Error: Could not get recipes');
                        setAlertSeverity('error');
                      }                   
                    }
                  });
                }

                setLoaded(true)

              } else if (response.status === 400) {
                if (alertOpen === false) {
                  setAlertOpen(true);
                  setAlertMessage('Error: Could not get recipes');
                  setAlertSeverity('error');
                }
              }
            }
      } catch (err) {
        if (alertOpen === false) {
          setAlertOpen(true);
          setAlertMessage('Error: Could not get recipes');
          setAlertSeverity('error');
        }      
      }
  }

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe?recipeId=${recipeId}`)
  }

  const CompletedRecipeCountCard = () => {
    if (completedRecipeCount !== null) {
      return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: 350, width: 350 }}>
          <CardContent>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', marginBottom: 2 }}>Number of Completed Recipes</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: 8 }}>
              <Typography data-testid='completed-recipe-count' variant='h1' sx={{ textAlign: 'center' }}>{completedRecipeCount}</Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }
  }

  const RecipeCard = () => {
      if (!rotdRecipe) {
          return (
              <>
                  Loading...
              </>
          )
      }

      const recipe = rotdRecipe;

      return (
          <Card sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 350, width: 350}}>
            <CardActionArea onClick={() => handleRecipeClick(rotdRecipeId)}>
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant='h6' sx={{padding: 2, fontWeight: 'bold'}}>Recipe Of The Day</Typography>
              </Box>
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <Typography sx={{paddingBottom: 2}}>{recipe.label.length > 37 ? `${recipe.label.substring(0, 37)}...` : recipe.label}</Typography>
                <CardMedia
                  data-testid='rotd-recipe'
                  component="img"
                  height="250"
                  image={recipe.images.REGULAR.url}
                  alt={recipe.label}
                />
              </Box>
            </CardActionArea>
          </Card>
      )
  }

  if (loaded === false) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', paddingTop: 5}}>
          <CircularProgress />
      </Box>
  )
}

  return (
    <Box>
      <Box sx={{padding: 4}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
          <Box sx={{marginLeft: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2}}>
            <RecipeCard /> 
          </Box>
          <Box sx={{marginRight: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2}}>
            <CompletedRecipeCountCard />
          </Box>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 4}}>
          <Typography variant='h5' sx={{paddingBottom: 4, fontWeight: 'bold'}}>Recommended Recipes For You</Typography>
          <RecipeList data-testid='recommended-recipe-list' recipes={recipes} recipeIds={recipeIds} favouritesList={false} accessToken={accessToken} alertOpen={alertOpen} setAlertOpen={setAlertOpen} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity}/>
        </Box>
      </Box>
      <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
    </Box>
  );
};

export default Home;
