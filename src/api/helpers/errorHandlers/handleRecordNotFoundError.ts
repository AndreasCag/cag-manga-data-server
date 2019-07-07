import logger from '@/utils/logger';
import { Response } from 'express';
import RecordNotFoundErrorBody from '../errorBodies/RecordNotFoundErrorBody';

export default (res: Response, message: string, params: Object) => {
  logger.warn({
    category: 'router',
    message: message,
    data: {
      params,
    },
  });

  res
    .status(404)
    .json(new RecordNotFoundErrorBody(message, params));
};
