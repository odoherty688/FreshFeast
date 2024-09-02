import { Request, Response } from 'express';
import { Filter, FilterDatabase, FilterId, FilterReturn } from '../interfaces/SearchFilterInterfaces.js';
import database from '../database.js';
import { RowDataPacket } from 'mysql2';
import { UserEmail } from '../interfaces/UserInterfaces.js';

export const addFilter = async (req: Request, res: Response) => {
    try {
        const filter: Filter = req.body;

        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        };

        if (typeof filter.email !== 'string' || isValidEmail(filter.email) === false) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }

        if (!filter.filterName || filter.filterName.trim() === '') {
            return res.status(200).json({error: true, data: null, message: 'Filter Name is required'});

        }

        if (!Array.isArray(filter.diet) || !filter.diet.every((item: string) => typeof item === 'string')) {
            return res.status(200).json({error: true, data: null, message: 'Diet must be an array of strings'});

        }

        if (!Array.isArray(filter.allergies) || !filter.allergies.every((item: string) => typeof item === 'string')) {
            return res.status(200).json({error: true, data: null, message: 'Allergies field must be an array of strings'});

        }

        if (typeof filter.cuisineType !== 'string' && filter.cuisineType !== '') {
            return res.status(200).json({error: true, data: null, message: 'Cuisine Type field must be a string or an empty string'});

        }

        if (typeof filter.mealType !== 'string' && filter.mealType !== '') {
            return res.status(200).json({error: true, data: null, message: 'Meal Type field must be a string or an empty string'});

        }

        if (typeof filter.dishType !== 'string' && filter.dishType !== '') {
            return res.status(200).json({error: true, data: null, message: 'Dish Type field must be a string or an empty string'});

        }

        const concatenatedDiet = filter.diet.join(', ');
        const concatenatedAllergies = filter.allergies.join(', ');

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${filter.email}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id

            const query = `
            INSERT INTO UserSearchFilters (userId, filterName, diet, allergies, cuisineType, mealType, dishType)
            VALUES (${id}, '${filter.filterName}', '${concatenatedDiet}', '${concatenatedAllergies}', '${filter.cuisineType}', '${filter.mealType}', '${filter.dishType}')
            `

            await database.query(query);

            return res.status(200).json({error: false, data: null, message: 'Filter added successfully'});
        } else {
            return res.status(200).json({error: true, data: null, message: 'User does not exist'});

        }
    } catch (error) {
        console.error('Error adding filter:', error);
        return res.status(500).json({error: true, data: null, message: 'Could not add filter'});
    }
}

export const deleteUserSearchFilter = async (req: Request, res: Response) => {
    try {
        const filter: FilterId = req.body;

        const isValidEmail = (email: string) => {
            // Basic regex pattern for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        };

        if (typeof filter.email !== 'string' || isValidEmail(filter.email) === false) {
            return res.status(200).json({error: true, data: null, message: 'Email is not valid'});
        }
    
        if (typeof filter.filterId !== 'number') {
            return res.status(200).json({error: true, data: null, message: 'Filter ID is not valid'});
        }

        const selectQuery = `
            SELECT id 
            FROM Users
            WHERE email = '${filter.email}';
        `;

        const idResult = await database.query(selectQuery);
        const rows = (idResult[0] as RowDataPacket[]);
        
        if(rows.length > 0) {
            const id: number = idResult[0][0].id
            const deleteQuery = `
                DELETE FROM UserSearchFilters
                WHERE userId = ${id} AND id = ${filter.filterId};
            `;
            const result = await database.query(deleteQuery)
            return res.status(200).json({error: false, data: result, message: `Successfully deleted filter`});
            console.log(`Successfully deleted filter with id ${filter.filterId}`)
        } else {
            console.log('User ID not found')
            return res.status(200).json({error: true, data: null, message: 'User ID not found'});
         }
    } catch (err) {
      console.error(err);
  
      return res.status(500).json({error: true, data: null, message: 'Could not delete filter'});
    }
};

export const getUserSearchFilters = async (req: Request, res: Response) => {
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

        const query = `SELECT * FROM UserSearchFilters WHERE userId = ${id}`;
        const result = await database.query(query);
    
        console.log("result: ", result)
        console.log("result length: ", result.length)
    
        const rows = (result[0] as RowDataPacket[]);
    
        if (rows.length > 0) {
            console.log('result[0]', result[0])
            const userFilters: FilterDatabase[] = result[0] as FilterDatabase[];

            const returnFilters: FilterReturn[] = userFilters.map((filterReturn: FilterDatabase) => {
                const diet = filterReturn.diet.split(',').map(value => value.trim()); 
                const allergies = filterReturn.allergies.split(',').map(value => value.trim()); 
            
                return {
                    id: filterReturn.id,
                    userId: filterReturn.userId,
                    filterName: filterReturn.filterName,
                    diet,
                    allergies,
                    cuisineType: filterReturn.cuisineType,
                    mealType: filterReturn.mealType,
                    dishType: filterReturn.dishType
                };
            });
           
            console.log('Filter Database: ', result[0][0] )
            console.log('Return Filters: ', returnFilters)
    
            return res.status(200).json({error: false, data: returnFilters, message: 'Successfully retrieved filters'});
        } else {
            return res.status(200).json({error: false, data: null, message: 'No available filters for this user'});
        }
      } else {
          return res.status(200).json({error: true, data: null, message: 'User does not exist'});
      }
      } catch (err) {
      console.error(err);
  
      return res.status(500).json({error: true, data: null, message: 'Could not get user data'});
    }
  }