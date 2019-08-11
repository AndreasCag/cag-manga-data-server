  // public name!: string;
  // public completeType!: 'ongoing' | 'completed';
  // public description!: string;
  // public mainImage!: string;
  // public backgroundImage!: string;
import { body, param } from 'express-validator';
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
  // tslint:disable-next-line:no-any
  .custom((value: any) => (
    Array.isArray(value)
    && value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');

export const subgenresBodyValidator = body('subgenres')
  .isArray()
  .withMessage('Should be array')
  // tslint:disable-next-line:no-any
  .custom((value: any) => (
    Array.isArray(value)
    && value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');

const momentMinDate = moment('1920', 'YYYY');

export const releaseDateValidator = body('releaseDate')
  .optional()
  .isNumeric()
  .withMessage('Should be number')
  // tslint:disable:no-any no-unsafe-any
  .custom((value: any) => {
    const momentDate = moment(value, 'x');
    const momentTodayDate = moment();

    return momentDate.isBetween(momentMinDate, momentTodayDate);
  });
  // tslint:enable:no-any no-unsafe-any
