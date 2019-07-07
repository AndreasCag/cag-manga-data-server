export default class ResponseErrorBody<TData = undefined> {
  constructor(
    public message: string,
    public code: number,
    public data?: TData,
  ) {}
}
