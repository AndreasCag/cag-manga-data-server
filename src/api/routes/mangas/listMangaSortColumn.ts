export type ListMangaSortColumn = 'popularity' | 'releaseDate' | 'name';

export const availableListMangaSortColumns: ListMangaSortColumn[] = ['popularity', 'releaseDate', 'name'];

// tslint:disable:no-any no-unsafe-any
export const isListMangaSortColumn = (val: any): val is ListMangaSortColumn => (
  availableListMangaSortColumns.includes(val)
);
// tslint:enable:no-any no-unsafe-any
