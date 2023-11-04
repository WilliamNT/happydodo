import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Routers
import animes from './routes/animes';

dotenv.config();
const port = process.env.EXPRESS_PORT;

const app = express();

app.use('/', animes);

app.listen(port, () => {
  console.log(`API is running at http://127.0.0.1:${port}`);
})