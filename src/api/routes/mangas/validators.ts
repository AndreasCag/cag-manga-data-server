  // public name!: string;
  // public completeType!: 'ongoing' | 'completed';
  // public description!: string;
  // public mainImage!: string;
  // public backgroundImage!: string;
import { body, param } from 'express-validator';

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
  .custom((value: any[]) => (
    value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');

export const subgenresBodyValidator = body('subgenres')
  .isArray()
  .withMessage('Should be array')
  // tslint:disable-next-line:no-any
  .custom((value: any[]) => (
    value.every(value => typeof value === 'number')
  ))
  .withMessage('Array should contain numbers');
