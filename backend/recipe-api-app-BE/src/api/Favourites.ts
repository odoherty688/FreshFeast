import express, { Request, Response } from 'express';
import database from '../database.js';
import { User, UserEmail, UserReturn } from '../interfaces/UserInterfaces.js';
import { RowDataPacket } from 'mysql2';
import { UserRecipe } from '../interfaces/RecipeInterfaces.js';

export const getUserFavouritedRecipes = async (req: Request, res: Response) => {
    try {
        if(!req.params || !req.params.email) {
            return res.status(200).json({error: true, data: null, message: 'Missing Email'});
        }

        const data = req.params.email;
        const email = decodeURIComponent(data)

        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
          };

        console.log("email", email)
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
                SELECT recipeId
                FROM UserFavouriteRecipes
                WHERE userId = ${id};
            `;
            const result = await database.query(insertQuery)

            const recipeIds = (result[0] as RowDataPacket[]).map((item: RowDataPacket) => item.recipeId);

            console.log("recipeIds", recipeIds)
            return res.status(200).json({error: false, data: recipeIds, message: 'Successfully retrieved user favourited recipes'});
        } else {
            return res.status(200).json({error: true, data: null, message: 'User ID not found'});
        }
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: true, data: null, message: 'Could not get user favourited recipes'});
    }
  };

export const addUserFavouritedRecipe = async (req: Request, res: Response) => {
    try {
        const userRecipe: UserRecipe = req.body;
        
        console.log("Body: ", req.body)
        console.log("userRecipe: ", userRecipe)

        if (typeof userRecipe.userEmail !== 'string' || userRecipe.userEmail === undefined) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof userRecipe.recipeId !== 'string' || userRecipe.recipeId === undefined) {
            return res.status(200).json({error: true, data: null, message: 'Recipe ID is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${userRecipe.userEmail}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                INSERT INTO UserFavouriteRecipes (userId, recipeId)
                VALUES (${id}, '${userRecipe.recipeId}');
            `;
            const result = await database.query(insertQuery)
            return res.status(200).json({error: false, data: result, message: 'Successfully added recipe to favourties'});
        } else {
           return res.status(200).json({error: true, data: null, message: 'User ID not found'});

        }
    } catch (err) { 
        console.log(err)
      return res.status(500).json({error: true, data: null, message: 'Could not add recipe to favourites'});
    }
};

export const deleteUserFavouritedRecipe = async (req: Request, res: Response) => {
    try {
        const userRecipe: UserRecipe = req.body;
        
        console.log("Body: ", req.body)
        console.log("userRecipe: ", userRecipe)
        if (typeof userRecipe.userEmail !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof userRecipe.recipeId !== 'string') {
            return res.status(200).json({error: true, data: null, message: 'Recipe ID is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${userRecipe.userEmail}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const insertQuery = `
                DELETE FROM UserFavouriteRecipes
                WHERE userId = ${id} AND recipeId = '${userRecipe.recipeId}';
            `;
            const result = await database.query(insertQuery)
            return res.status(200).json({error: false, data: result, message: 'Successfully removed recipe from favourites'});
        } else {
            console.log('User ID not found')
            return res.status(200).json({error: true, data: null, message: 'User ID not found'});

         }
    } catch (err) {
      console.error(err);
  
      return res.status(500).json({error: true, data: null, message: 'Could not remove recipe to favourites'});
    }
};
