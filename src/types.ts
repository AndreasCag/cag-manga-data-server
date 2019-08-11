export type SortOrder = 'ascending' | 'descending';

export const availableSortOrders: SortOrder[] = ['ascending', 'descending'];

// tslint:disable:no-any no-unsafe-any
export const isSortOrder = (value: any) => {
  return availableSortOrders.includes(value);
};

export const sequelizeSortOrderMap: { [s in SortOrder]: string } = {
  ascending: 'ASC',
  descending: 'DESC',
};
