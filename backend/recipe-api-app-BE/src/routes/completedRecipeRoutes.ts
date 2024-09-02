import express from 'express';
import { addUserCompletedRecipe, deleteUserCompletedRecipe, getUserCompletedRecipes } from '../api/CompletedRecipes.js';

const completedRecipeRoutes = express.Router();

completedRecipeRoutes.get('/completedRecipes/getUserCompletedRecipes/:email', getUserCompletedRecipes);
completedRecipeRoutes.post('/completedRecipes/addUserCompletedRecipe', addUserCompletedRecipe);
completedRecipeRoutes.delete('/completedRecipes/deleteUserCompletedRecipe', deleteUserCompletedRecipe);

export default completedRecipeRoutes;