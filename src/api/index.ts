import logger from '@/utils/logger';
import bodyParser from 'body-parser';
import { NextFunction } from 'connect';
import Express, { Request, Response } from 'express';
import UnrecognisedErrorBody from './helpers/errorBodies/UnrecognisedErrorBody';
import initialiseRoutes from './routes/initialiseRoutes';

export const app = Express();

app.use(bodyParser.json());

initialiseRoutes(app);

app.use('*', (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.warn({
    category: 'router',
    message: 'Get error in base error handler',
    data: {
      err,
      stringifiedError: err.toString(),
    },
  });

  res
    .status(500)
    .json(new UnrecognisedErrorBody('Unrecognised internal server error', err));
});
