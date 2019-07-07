import BaseErrorBody from './BaseErrorBody';

export default class ValidationErrorBody extends BaseErrorBody<Object> {
  constructor(message: string, params: Object) {
    super(message, 4, params);
  }
}
