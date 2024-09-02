import express, { Request, Response } from 'express';
import database from '../database.js';
import { RowDataPacket } from 'mysql2';
import { UserRestaurant } from '../interfaces/Restaurants.js';

export const getUserFavouritedRestaurants = async (req: Request, res: Response) => {
    try {
        const data = req.params.email;
        const email = decodeURIComponent(data)

        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
          };

        console.log("email", email)
        if (typeof email !== 'string' && isValidEmail(email) === false) {
            res.status(200).json({error: true, data: null, message: 'Email is not valid'});
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
                SELECT restaurantId
                FROM UserFavouritedRestaurants
                WHERE userId = ${id};
            `;
            const result = await database.query(insertQuery)

            const restaurantIds = (result[0] as RowDataPacket[]).map((item: RowDataPacket) => item.restaurantId);

            return res.status(200).json({error: false, data: restaurantIds, message: 'Successfully retrieved user favourited restaurants'});
        } else {
            return res.status(200).json({error: true, data: null, message: 'User not found'});
        }
    } catch (err) {
      console.error(err);
      return res.status(200).json({error: true, data: null, message: 'Could not add restaurant'});
    }
  };

export const addUserFavouritedRestaurant = async (req: Request, res: Response) => {
    try {
        const userRestaurant: UserRestaurant = req.body;
        
        console.log("Body: ", req.body)
        console.log("userRestaurants: ", userRestaurant)
        if (typeof userRestaurant.userEmail !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof userRestaurant.restaurantId !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Restaurant Id is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${userRestaurant.userEmail}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                INSERT INTO UserFavouritedRestaurants (userId, restaurantId)
                VALUES (${id}, '${userRestaurant.restaurantId}');
            `;
            const result = await database.query(insertQuery)
            return res.status(200).json({error: false, data: result, message: 'Successfully added restaurant to favourites'});
        } else {
            return res.status(200).json({error: true, data: null, message: 'User not found'});
        }
    } catch (err) {
      console.error(err);
  
      return res.status(200).json({error: true, data: null, message: 'Could not add restaurant'});
    }
};

export const deleteUserFavouritedRestaurant = async (req: Request, res: Response) => {
    try {
        const userRestaurant: UserRestaurant = req.body;

        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        };
        
        console.log("Body: ", req.body)
        console.log("userRestaurant: ", userRestaurant)

        if (typeof userRestaurant.userEmail !== 'string' || isValidEmail(userRestaurant.userEmail) === false) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof userRestaurant.restaurantId !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Restaurant Id is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${userRestaurant.userEmail}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                DELETE FROM UserFavouritedRestaurants
                WHERE userId = ${id} AND restaurantId = '${userRestaurant.restaurantId}';
            `;
            const result = await database.query(insertQuery)
            return res.status(200).json({error: false, data: result, message: 'Successfully removed restaurant to favourites'});
        } else {
            console.log('User ID not found')
            return res.status(200).json({error: true, data: null, message: 'User not found'});
         }
    } catch (err) {
      console.error(err);
      return res.status(200).json({error: true, data: null, message: 'Could not add restaurant'});
    }
};
