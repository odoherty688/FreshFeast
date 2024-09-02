import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import React, { Dispatch, SetStateAction } from 'react';
import { UserRecipe } from "../../interfaces/RecipeInterfaces";
import { AlertColor } from "@mui/material";

const addRecipeToFavourites = async (accessToken: string, userEmail: string, recipeId: string, alertOpen: boolean, setAlertOpen: Dispatch<SetStateAction<boolean>>, setAlertMessage: Dispatch<SetStateAction<string>>, setAlertSeverity: React.Dispatch<React.SetStateAction<AlertColor>>) => {
    try {
        const data: UserRecipe = {
            userEmail: userEmail,
            recipeId: recipeId
        }  

        const result = await axios.post(`http://localhost:8000/api/recipes/addUserFavouritedRecipe`, data, {
            headers: {
            "Authorization": `bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        },
        });

        console.log('addRecipeToFavourites: ', result)


        if (result.data.error === true) {
            if (alertOpen === false) {
                setAlertOpen(true);
                setAlertMessage('Error: Could not add recipe to favourites');
                setAlertSeverity('error');
            }       
        }
    } catch (err) {
        console.error(err);
        if (alertOpen === false) {
            setAlertOpen(true);
            setAlertMessage('Error: Could not add recipe to favourites');
            setAlertSeverity('error');
        }
    }
}

export default addRecipeToFavourites;