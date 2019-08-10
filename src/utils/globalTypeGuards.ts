// tslint:disable-next-line:no-any
export const isObject = (val: any): val is object => {
  return val !== null && typeof val === 'object';
};
