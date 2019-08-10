import ApplicationError from './ApplicationError';

export default class UnexpectedParameterError extends ApplicationError {
  public name = 'UnexpectedParameterError';

  constructor(public parameterName: string, public violation: string, public data: Object) {
    super(`[${parameterName}] ${violation}`);
  }
}
