import BasePrivateDataErrorBody from './BasePrivateDataErrorBody';

type Data = {
  err: Error;
};

export default class DatabaseResponseErrorBody extends BasePrivateDataErrorBody<Data> {
  constructor(message: string, err: Error) {
    super(message, 2, { err });
  }
}
