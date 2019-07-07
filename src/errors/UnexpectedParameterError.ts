import ApplicaionError from './ApplicaionError';

export default class UnexpectedParameterError extends ApplicaionError {
  public name = 'UnexpectedParameterError';

  constructor(public fieldName: string, public violation: string, public data: Object) {
    super(`[${fieldName}] ${violation}`);
  }
}
