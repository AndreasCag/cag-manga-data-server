import { availableSortOrders, isSortOrder } from '@/types';
import { query } from 'express-validator';

export default query('sortOrder')
  .custom(isSortOrder)
  .withMessage(`Value should be one of these values: ${availableSortOrders.join(' ')}`);
