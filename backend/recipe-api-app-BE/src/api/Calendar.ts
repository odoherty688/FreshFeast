import express, { Request, Response } from 'express';
import { DeletedEvent, EventToDatabase } from "../interfaces/CalendarInterfaces.js";
import { RowDataPacket } from 'mysql2';
import database from '../database.js';
import moment from 'moment';
import { UserRecipe } from '../interfaces/RecipeInterfaces.js';

export const getUserCalendarEvents = async (req: Request, res: Response) => {
    try {
        const data = req.params.email;
        const email = decodeURIComponent(data)
        console.log(req.params.email)
        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
            };

        if (typeof email !== 'string' || isValidEmail(email) === false) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${email}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                SELECT
                    userId,
                    resourceId,
                    recipeId,
                    start,
                    end,
                    isDraggable,
                    isResizable
                FROM UserCalendarEvents
                WHERE userId = ${id};
            `;
            const result = await database.query(insertQuery)

            console.log("Events", result[0])

            return res.status(200).json({error: false, data: result[0], message: 'Successfully retrieved calendar events in database'});

        } else {
            return res.status(200).json({error: true, data: null, message: 'User not found'});
        }

    } catch (err) {
        return res.status(500).json({error: false, data: null, message: 'Could not get user events'});
      }
}

export const addUserCalendarEvents = async (req: Request, res: Response) => {
    try {

        const calendarEvents: EventToDatabase[] = req.body;
        
        console.log("Body: ", req.body)
        console.log("userRecipe: ", calendarEvents)

        const responses = await Promise.all(calendarEvents.map(async (event: EventToDatabase) => {
            if (!event.userEmail || typeof event.userEmail !== 'string') {
                return { error: true, data: null, message: 'Email is not valid' };
            }

            if (!event.isDraggable || typeof event.isDraggable !== 'boolean') {
                return { error: true, data: null, message: 'isDraggable variable is not valid' };
            }

            if (!event.isResizable || typeof event.isResizable !== 'boolean') {
                return { error: true, data: null, message: 'isResizable variable is not valid' };
            }

            if (event.resourceId < 0) {
                return { error: true, data: null, message: 'Resource ID variable is not valid' };
            }

            if (!event.recipeId || typeof event.recipeId !== 'string') {
                return { error: true, data: null, message: 'Recipe ID is not valid' };
            }

            const selectQuery = `
                SELECT id 
                FROM Users
                WHERE email = '${event.userEmail}';
            `;

            const idResult = await database.query(selectQuery);
            const rows = idResult[0] as RowDataPacket[];

            if (rows.length > 0) {
                const id: number = idResult[0][0].id;
                const startDate = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
                const endDate = moment(event.end).format('YYYY-MM-DD HH:mm:ss');
                const insertQuery = `
                    INSERT INTO UserCalendarEvents (userId, resourceId, recipeId, start, end, isDraggable, isResizable)
                    VALUES (${id}, ${event.resourceId}, '${event.recipeId}', '${startDate}', '${endDate}', ${event.isDraggable ? 1 : 0}, ${event.isResizable ? 1 : 0});
                `;
                await database.query(insertQuery);
                return null; // No error, return null
            } else {
                return { error: true, data: null, message: 'User not found' };
            }
        }));

        // Check if any errors occurred
        const errorResponse = responses.find(response => response !== null && response.error);
        if (errorResponse) {
            return res.status(200).json(errorResponse);
        }

        return res.status(200).json({ error: false, data: null, message: 'Successfully saved calendar events in database' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: false, data: null, message: 'Could not add user event'});
    }
};

export const deleteUserCalendarEvents = async (req: Request, res: Response) => {
    try {
        const data = req.params.email;
        const email = decodeURIComponent(data)
        console.log(req.params.email)
        const isValidEmail = (email: string) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        };

        if (typeof email !== 'string' || isValidEmail(email) === false) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${email}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                DELETE FROM UserCalendarEvents
                WHERE userId = ${id};
            `;
            const result = await database.query(insertQuery)

            console.log("Events", result[0])
            return res.status(200).json({error: false, data: result, message: 'Successfully deleted all user events'});
        } else {
            return res.status(200).json({error: true, data: null, message: 'User not found'});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: false, data: null, message: 'Could not remove user event'});
      }
}

export const deleteUserCalendarEvent = async (req: Request, res: Response) => {
    try {
        const userEvent: DeletedEvent = req.body;
        
        console.log("Body: ", req.body)
        console.log("userRecipe: ", userEvent)
        if (typeof userEvent.userEmail !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof userEvent.recipeId !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Recipe ID is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${userEvent.userEmail}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const startDate = moment(userEvent.start).format('YYYY-MM-DD HH:mm:ss');
            const endDate = moment(userEvent.end).format('YYYY-MM-DD HH:mm:ss');
            const insertQuery = `
                DELETE FROM UserCalendarEvents
                WHERE userId = ${id} AND recipeId = '${userEvent.recipeId}' AND start = '${startDate}' AND end = '${endDate}';
            `;
            const result = await database.query(insertQuery)
            return res.status(200).json({error: false, data: result, message: 'Successfully removed event from user events'});
        } else {
            console.log('User ID not found')
            return res.status(200).json({error: true, data: null, message: 'User ID not found'});

         }
    } catch (err) {
      console.error(err);
  
      return res.status(500).json({error: false, data: null, message: 'Could not remove event from user events'});
    }
};