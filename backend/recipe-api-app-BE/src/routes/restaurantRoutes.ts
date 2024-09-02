import express from 'express';
import { getUserFavouritedRestaurants, addUserFavouritedRestaurant, deleteUserFavouritedRestaurant } from '../api/Restaurants.js';

const restaurantRoutes = express.Router();

restaurantRoutes.get('/restaurants/getUserFavouritedRestaurants/:email', getUserFavouritedRestaurants);
restaurantRoutes.post('/restaurants/addUserFavouritedRestaurant', addUserFavouritedRestaurant);
restaurantRoutes.delete('/restaurants/deleteUserFavouritedRestaurant', deleteUserFavouritedRestaurant);

export default restaurantRoutes;