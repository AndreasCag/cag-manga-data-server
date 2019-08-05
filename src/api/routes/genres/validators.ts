import Genre, { maxDescriptionLength, maxNameLength } from '@/db/models/Genre';
import logger from '@/utils/logger';
import { body, param } from 'express-validator';
import { Op } from 'sequelize';
import { GenreParams } from '.';

export const newNameBodyValidator = body('name')
  .isString()
  .withMessage('Should be string')
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty')
  .isLength({ max: maxNameLength })
  .withMessage(`Should have length <= ${maxNameLength}`)
  .custom(async (value: string) => {
    try {
      const genre = await Genre
        .findOne({ where: { name: value } });

      logger.debug({
        category: 'router',
        message: 'Get genre for validation',
        data: {
          genre: genre && genre.toJSON(),
        },
      });

      if (genre !== null) {
        throw new Error('Genre with that name already exists');
      }
    } catch (err) {
      logger.warn({
        category: 'router',
        message: 'Catch err on genre valdation',
        data: {
          err,
        },
      });

      throw new Error('Custom validator request failed');
    }
  })
  .withMessage(`Should be unique`);

export const updateNameBodyValidator = body('name')
  .isString()
  .withMessage('Should be string')
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty')
  .isLength({ max: maxNameLength })
  .withMessage(`Should have length <= ${maxNameLength}`)
  .custom(async (value: string, { req }) => {
    const params = <GenreParams>req.params;

    try {
      const genre = await Genre
        .findOne({ where: { name: value, id: { [Op.not]: params.id } } });

      logger.debug({
        category: 'router',
        message: 'Get genre for update validation',
        data: {
          genre: genre && genre.toJSON(),
        },
      });

      if (genre !== null) {
        throw new Error('Genre with that name already exists');
      }
    } catch (err) {
      logger.warn({
        category: 'router',
        message: 'Catch err on genre update validation',
        data: {
          err,
        },
      });

      throw new Error('Custom validator request failed');
    }
  })
  .withMessage(`Should be unique`);

export const descriptionBodyValidator = body('description')
  .isString()
  .withMessage(`Should be string`)
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty')
  .isLength({ max: maxDescriptionLength })
  .withMessage(`Should have length <= ${maxDescriptionLength}`);

export const imageBodyValidator = body('image')
  .isString()
  .withMessage(`Should be string`)
  .not()
  .isEmpty()
  .withMessage('Shouldn\'t be empty');

export const idParamValidator = param('id')
  .not()
  .isEmpty()
  .withMessage('Should not be empty');
