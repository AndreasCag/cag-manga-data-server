import { isNaturalNumber } from '@/utils/globalDataCheckers';
// tslint:disable:no-any no-unsafe-any

  // public name!: string;
  // public completeType!: 'ongoing' | 'completed';
  // public description!: string;
  // public mainImage!: string;
  // public backgroundImage!: string;
import { body, param, query } from 'express-validator';
import moment from 'moment';

export const nameBodyValidator = body('name')
  .isString()
  .withMessage('Should be string')
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty');

export const completeTypeBodyValidator = body('completeType')
  .isIn(['ongoing', 'completed'])
  .withMessage('Should be ongoing or completed');

export const descriptionBodyValidator = body('description')
  .isString()
  .withMessage(`Should be string`)
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty');

export const mainImageBodyValidator = body('mainImage')
  .isString()
  .withMessage(`Should be string`)
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty');

export const backgroundImageBodyValidator = body('backgroundImage')
  .isString()
  .withMessage(`Should be string`)
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty');

export const idParamValidator = param('id')
  .not()
  .isEmpty()
  .withMessage('Should not be empty');

export const genresBodyValidator = body('genres')
  .isArray()
  .withMessage('Should be array')
  .custom((value: any) => (
    Array.isArray(value)
    && value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');

export const subgenresBodyValidator = body('subgenres')
  .isArray()
  .withMessage('Should be array')
  .custom((value: any) => (
    Array.isArray(value)
    && value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');

const momentMinDate = moment('1920', 'YYYY');

export const releaseDateValidator = body('releaseDate')
  .optional()
  .custom(isNaturalNumber)
  .withMessage('Should be natural number')
  .custom((value: any) => {
    const momentDate = moment(value, 'x');
    const momentTodayDate = moment();

    return momentDate.isBetween(momentMinDate, momentTodayDate);
  })
  .withMessage('Should be real release date');

export const limitValidator = query('limit')
  .custom((value: any) => isNaturalNumber(Number(value)))
  .withMessage('Should be natural number')
  .custom((value: any) => Number(value) <= 100)
  .withMessage('Maximal limit is 100');

export const offsetValidator = query('offset')
  .custom((value: any) => isNaturalNumber(Number(value)))
  .withMessage('Should be natural number');

  // tslint:enable:no-any no-unsafe-any
