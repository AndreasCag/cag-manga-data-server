// tslint:disable:no-any no-unsafe-any
export const isNaturalNumber = (value: any) => {
  if (typeof value !== 'number') {
    return false;
  }

  return value >= 0
    && Math.floor(value) === value
    && value !== Infinity;
};
// tslint:enable:no-any no-unsafe-any
