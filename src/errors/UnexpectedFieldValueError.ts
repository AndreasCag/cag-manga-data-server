import ApplicationError from './ApplicationError';

export default class UnexpectedFieldValueError extends ApplicationError {
  public name = 'UnexpectedFieldValueError';

  constructor(public parameterName: string, public violation: string, public data: Object) {
    super(`[${parameterName}] ${violation}`);
  }
}
