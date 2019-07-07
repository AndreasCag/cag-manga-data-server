import { Express } from 'express';
import genres from './genres';

export default (app: Express) => {
  app.use('/genres', genres);
};
