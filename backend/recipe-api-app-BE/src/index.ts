import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwks from 'jwks-rsa';
import userRoutes from './routes/userRoutes.js';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library
import bodyParser from 'body-parser';
import recipeRoutes from './routes/recipeRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import searchFilterRoutes from './routes/searchFilterRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import completedRecipeRoutes from './routes/completedRecipeRoutes.js';

dotenv.config();

const app: Application = express();

app.use(cors())
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

// For JWT authentication
export const jwtCheck = expressjwt({
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://freshfeast-40300091.uk.auth0.com/.well-known/jwks.json"
  }) as GetVerificationKey
});

// export const jwtCheck = auth({
//   audience: process.env.AUTH0_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_DOMAIN,
//   tokenSigningAlg: "RS256"
// });

// Function to log decoded token
const logDecodedToken = (req: Request, res: Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const decodedToken = jwt.decode(token, { complete: true });
    console.log("Decoded Token:", decodedToken);
  }
  next();
};

// Apply JWT check middleware and logging middleware to all routes
app.use(logDecodedToken);

// Apply JWT check middleware to all routes
app.use(jwtCheck);


// jwtCheck

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

// Use the loginRoutes
app.use('/api', userRoutes);
app.use('/api', recipeRoutes);
app.use('/api', calendarRoutes);
app.use('/api', searchFilterRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', completedRecipeRoutes);

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});
