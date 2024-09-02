import axios from 'axios';
import express, { Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import database from '../database.js';
import { User, UserEmail, UserReturn } from '../interfaces/UserInterfaces.js';
import { RowDataPacket } from 'mysql2';

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.uemail;

    const query = `SELECT * FROM Users`

    const result = await database.query(query);
    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const data: UserEmail = (req.body);

    const email = data.email
    console.log(data.email);
    if (!email) {
      return res.status(400).json({ error: 'Email is required in the request body' });
    }

    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await database.query(query);

    console.log("result: ", result)
    console.log("result length: ", result.length)

    const rows = (result[0] as RowDataPacket[]);

    // Check the length of the rows array
    if (rows.length > 0) {
      const user: UserReturn = result[0][0];
      const diet = user.diet.split(',').map(value => value.trim()); 
      const allergies = user.allergies.split(',').map(value => value.trim()); 

      const arrayUser: User = {
        id: user.id,
        email: user.email,
        picture: user.picture,
        diet,
        allergies,
        completedRecipeCount: user.completedRecipeCount
      }
      console.log('User: ', user)
      console.log('ArrayUser: ', arrayUser)

      // User found
      res.status(200).json({ userExists: true, userData: arrayUser });
    } else {
      // User not found
      res.status(200).json({ userExists: false, userData: null});
    }
    } catch (err) {
    console.error(err);

    res.status(500).json({ error: 'Could not get user data' });
  }
}

export const addUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    // Check email
    if (typeof user.email !== 'string') {
      throw new Error('Email is not valid');
    }

    // Check picture
    if (typeof user.picture !== 'string') {
      throw new Error('Picture is not valid');
    }

    // Check diet
    if (!Array.isArray(user.diet) || !user.diet.every((item) => typeof item === 'string')) {
      throw new Error('Diet is not valid');
    }

    // Check allergies
    if (!Array.isArray(user.allergies) || !user.allergies.every((item) => typeof item === 'string')) {
      throw new Error('Allergies are not valid');
    }
    
    if (typeof user.completedRecipeCount !== 'number') {
      throw new Error('Completed recipe count not valid')
    }

    const concatenatedDiet = user.diet.join(', ');
    const concatenatedAllergies = user.allergies.join(', ');

    const query = `
      INSERT INTO Users (email, picture, diet, allergies, completedRecipeCount)
      VALUES ('${user.email}', '${user.picture}', '${concatenatedDiet}', '${concatenatedAllergies}', '${user.completedRecipeCount}')
    `

    await database.query(query);

    console.log('User Successfully inserted into database', user.email)

    return res.status(200).json({ message: `User successfully inserted into the database: ${user.email} ` })
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    // Check email
    if (typeof user.email !== 'string') {
      throw new Error('Email is not valid');
    }

    // Check diet
    if (!Array.isArray(user.diet) || !user.diet.every((item) => typeof item === 'string')) {
      throw new Error('Diet is not valid');
    }

    // Check allergies
    if (!Array.isArray(user.allergies) || !user.allergies.every((item) => typeof item === 'string')) {
      throw new Error('Allergies are not valid');
    }

    const concatenatedDiet = user.diet.join(', ');
    const concatenatedAllergies = user.allergies.join(', ');

    const query = `SELECT * FROM users WHERE email = '${user.email}'`;
    const result = await database.query(query);

    console.log("result: ", result)
    console.log("result length: ", result.length)

    const rows = (result[0] as RowDataPacket[]);

    // Check the length of the rows array
    if (rows.length > 0) {
      const query = `
        UPDATE Users
        SET diet = '${concatenatedDiet}', allergies = '${concatenatedAllergies}'
        WHERE email = '${user.email}'
        `

      await database.query(query);

      const message = `User Information Successfully updated in database.`

      return res.status(200).json({ message: message })
    } else {
      return res.status(200).json({ message: `Could not find user with email '${user.email}'`})
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'An error occured' });
  }
}


export const updateUserCompletedRecipeCount = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    console.log(user)
    // Check email
    if (typeof user.email !== 'string') {
      throw new Error('Email is not valid');
    }

    if (typeof user.completedRecipeCount !== 'number') {
      throw new Error('Completed recipe count not valid')
    }

    const query = `SELECT * FROM users WHERE email = '${user.email}'`;
    const result = await database.query(query);
    
    const rows = (result[0] as RowDataPacket[]);

    // Check the length of the rows array
    if (rows.length > 0) {
      const query = `
        UPDATE Users
        SET completedRecipeCount = ${user.completedRecipeCount}
        WHERE email = '${user.email}'
        `

      await database.query(query);

      const message = `User Information Successfully updated in database.`

      return res.status(200).json({ message: message })
    } else {
      return res.status(200).json({ message: `Could not find user with email '${user.email}'`})
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'An error occured' });
  }
}

