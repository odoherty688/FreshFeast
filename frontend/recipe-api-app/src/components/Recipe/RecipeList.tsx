import { useAuth0 } from "@auth0/auth0-react";
import { Grid, Card, CardActionArea, Box, CardMedia, Typography, IconButton, AlertColor } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteRecipeFromFavourites from "../../api/Recipe/deleteRecipeFromFavourites";
import addRecipeToFavourites from "../../api/Recipe/addRecipeToFavourites";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import theme from "../Theme";
import { truncateString } from "../truncateString";

interface RecipeListInterface {
    recipes: any[]
    recipeIds: string[]
    favouritesList: boolean
    accessToken: string,
    alertOpen: boolean,
    setAlertOpen: Dispatch<SetStateAction<boolean>>,
    setAlertMessage: Dispatch<SetStateAction<string>>,
    setAlertSeverity:  Dispatch<SetStateAction<AlertColor>>,
    favouritedRecipeIds?: string[]
}

const RecipeList = ({recipes, recipeIds, favouritesList, accessToken, alertOpen, setAlertOpen, setAlertMessage, setAlertSeverity, favouritedRecipeIds}: RecipeListInterface) => {
    const {user} = useAuth0();
    const navigate = useNavigate();

    const handleRecipeClick = (recipeId: number) => {
        console.log('index', recipeId)
        navigate(`/recipe?recipeId=${recipeId}`)
      }

    const RecipeListItem = ({recipe, recipeId, index}: any) => {
      const [favourited, setFavourited] = useState<boolean>(false)

      useEffect(() => {
        if (recipeId !== null && favouritedRecipeIds && favouritedRecipeIds.includes(recipeId)) {
          setFavourited(true);
        } else {
          setFavourited(false);
        }
      }, [recipeId, favouritedRecipeIds]);
      
      let time = recipe.totalTime > 0;
      function roundToDecimalPlaces(value: number): number {
        const factor = 10 ** 1;
        return Math.round(value * factor) / factor;
      }

      function formatDuration(minutes: number): string {
        if (isNaN(minutes) || minutes < 0) {
          return 'Invalid input';
        }
        console.log(recipe.totalTime)
      
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
      
        if (hours === 0) {
          return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
        }
      
        const hoursText = hours > 1 ? `${hours} hours` : '1 hour';
        const minutesText = remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : '';
      
        return `${hoursText}${minutesText}`;
      }

      const handleFavourite = () => {
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

      return (
        <Grid item key={`recipe-list-${index}`}>
          <Card sx={{minWidth: '100vh'}}>
            <CardActionArea onClick={() => handleRecipeClick(recipeId)}>
              <Box data-testid={`recipe-list-${index}`} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  height="150"
                  width="150"
                  src={recipe.images.THUMBNAIL.url}
                  alt={recipe.label}
                  sx={{maxHeight: 150, maxWidth: 150}}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 2 }}>
                  <Typography
                    sx={{ display: 'inline', fontWeight: 'bold' }}
                    component="span"
                    variant="body1"
                    color="text.primary"
                  >
                    {truncateString(recipe.label, 50)}
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', paddingTop: 2}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Calories: {roundToDecimalPlaces(recipe.calories)}
                  </Typography>
                  <Typography
                    sx={{ display: 'inline', paddingTop: 2}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Meal Type: {recipe.mealType}
                  </Typography>
                  {time === true ? (
                  <Typography
                    sx={{ display: 'inline', paddingTop: 2}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Time: {formatDuration(recipe.totalTime)}
                  </Typography>
                  ) : (<></>)}
                </Box>
              </Box>
            </CardActionArea>
            {favouritesList ? (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.secondary.light }}>
                <IconButton
                  data-testid={`favourite-button-${index}`}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => handleFavourite()}
                >
                  { favourited === true ? (
                    <Favorite sx={{color: theme.palette.secondary.dark}}/>
                  ) : (
                    <FavoriteBorder sx={{color: theme.palette.secondary.dark}}/>
                  )
                  }
                </IconButton>
              </Box>
            ) : (
              <></>
            )}
          </Card>
        </Grid>
      );
    }

    return (
      <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {recipes.map((recipe, index) => (
          <RecipeListItem key={index} index={index} recipe={recipe} recipeId={recipeIds[index]} handleRecipeClick={handleRecipeClick} />
        ))}
      </Grid>
    );
  };

export default RecipeList;