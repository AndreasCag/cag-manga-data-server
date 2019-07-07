import BasePrivateDataErrorBody from './BasePrivateDataErrorBody';

type Data = {
  err: Error;
};

export default class UnrecognisedErrorBody extends BasePrivateDataErrorBody<Data> {
  constructor(message: string, err: Error) {
    super(message, 1, { err });
  }
}
