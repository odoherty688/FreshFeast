import express from 'express';
import { getUser, getUserInfo, addUser, editUser, updateUserCompletedRecipeCount } from '../api/User.js';

const userRoutes = express.Router();

userRoutes.get('/users/getUserInfo', getUserInfo);
userRoutes.post('/users/getUser', getUser);
userRoutes.post('/users/addUser', addUser);
userRoutes.put('/users/editUser', editUser);
userRoutes.put('/users/updateUserCompletedRecipeCount', updateUserCompletedRecipeCount);

export default userRoutes;