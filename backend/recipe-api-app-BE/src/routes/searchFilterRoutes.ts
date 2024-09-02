import express from 'express';
import { addFilter, deleteUserSearchFilter, getUserSearchFilters } from '../api/SearchFilters.js';

const searchFilterRoutes = express.Router();

searchFilterRoutes.post('/searchFilters/addFilter', addFilter);
searchFilterRoutes.get('/searchFilters/getUserSearchFilters/:email', getUserSearchFilters)
searchFilterRoutes.delete('/searchFilters/deleteUserSearchFilter', deleteUserSearchFilter)

export default searchFilterRoutes;