import { ValidationError } from 'express-validator';
import BaseErrorBody from './BaseErrorBody';

type ErrorData = {
  errors: ValidationError[];
};

export default class ValidationErrorBody extends BaseErrorBody<ErrorData> {
  public data: ErrorData;

  constructor(errors: ValidationError[]) {
    super('Validation errors', 3, { errors });
  }
}
