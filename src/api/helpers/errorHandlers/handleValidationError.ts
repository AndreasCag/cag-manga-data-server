import logger from '@/utils/logger';
import { Response } from 'express';
import { ValidationError } from 'express-validator';
import ValidationErrorBody from '../errorBodies/ValidationErrorBody';

export default (res: Response, errors: ValidationError[], message: string) => {
  logger.warn({
    category: 'router',
    message: message,
    data: {
      errors,
    },
  });

  res
    .status(422)
    .json(new ValidationErrorBody(errors));
};
