import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Routers
import animes from './routes/animes';
import feed from './routes/feed';

dotenv.config();
const port = process.env.EXPRESS_PORT;

const app = express();

app.use(cors());

app.use('/animes', animes);
app.use('/feed', feed);


app.listen(port, () => {
  console.log(`API is running at http://127.0.0.1:${port}`);
})