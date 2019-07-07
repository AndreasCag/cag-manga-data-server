import { isDev } from '@/utils/config';
import BaseErrorBody from './BaseErrorBody';

export default class BasePrivateDataErrorBody<TData extends Object> extends BaseErrorBody<TData> {
  constructor(message: string, code: number, data?: TData) {
    const safeData = isDev ? data : undefined;

    super(message, code, safeData);
  }
}
