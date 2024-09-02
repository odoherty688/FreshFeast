import express from 'express';
import { addUserCalendarEvents, deleteUserCalendarEvent, deleteUserCalendarEvents, getUserCalendarEvents } from '../api/Calendar.js';

const calendarRoutes = express.Router();

calendarRoutes.post('/calendar/addUserCalendarEvents', addUserCalendarEvents);
calendarRoutes.get('/calendar/getUserCalendarEvents/:email', getUserCalendarEvents);
calendarRoutes.delete('/calendar/deleteUserCalendarEvents/:email', deleteUserCalendarEvents);
calendarRoutes.delete('/calendar/deleteUserCalendarEvent', deleteUserCalendarEvent);


export default calendarRoutes;