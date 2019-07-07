import UnexpectedParameterError from '@/errors/UnexpectedParameterError';
import logger from '@/utils/logger';
import { Response } from 'express';
import { DatabaseError } from 'sequelize/types/index';
import clearDatabaseError from '../clearDatabaseError';
import DatabaseResponseErrorBody from '../errorBodies/DatabaseResponseErrorBody';

// tslint:disable-next-line:no-any
const isDatabaseError = (err: any): err is DatabaseError => {
  if (!(err instanceof Object)) {
    return false;
  }

  /* tslint:disable:no-unsafe-any */
  return err.hasOwnProperty('parent')
    && err.hasOwnProperty('original')
    && err.hasOwnProperty('sql');
  /* tslint:enable:no-unsafe-any */
};

// tslint:disable-next-line:no-any
export default (res: Response, err: any, message: string) => {
  if (isDatabaseError(err)) {
    clearDatabaseError(err);
  }

  logger.warn({
    category: 'router',
    message: message,
    data: {
      err,
    },
  });

  res
    .status(500)
    .json(new DatabaseResponseErrorBody(message, err));

  return;
};
