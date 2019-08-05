import { Express } from 'express';
import genres from './genres';
import mangas from './mangas';

export default (app: Express) => {
  app.use('/genres', genres);
  app.use('/mangas', mangas);
};
