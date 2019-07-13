import { BaseError, DatabaseError, ValidationError } from 'sequelize/types';

// tslint:disable-next-line:no-any
const isValidationError = (err: any): err is ValidationError => {
  if (!(err instanceof Object)) {
    return false;
  }

  // tslint:disable-next-line:no-unsafe-any
  return err.hasOwnProperty('errors');
};

export default (error: BaseError) => {
  if (isValidationError(error)) {
    for (const validationError of error.errors) {
      // tslint:disable-next-line:no-any
      (<any>validationError).instance = (<any>validationError).instance.toJSON();
    }
  }
};
