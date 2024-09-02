import express from 'express';
import { addUserFavouritedRecipe, deleteUserFavouritedRecipe, getUserFavouritedRecipes } from '../api/Favourites.js';

const recipeRoutes = express.Router();

recipeRoutes.get('/recipes/getUserFavouritedRecipes/:email', getUserFavouritedRecipes);
recipeRoutes.post('/recipes/addUserFavouritedRecipe', addUserFavouritedRecipe);
recipeRoutes.delete('/recipes/deleteUserFavouritedRecipe', deleteUserFavouritedRecipe);

export default recipeRoutes;