import Genre, { maxDescriptionLength, maxNameLength } from '@/db/models/Genre';
import logger from '@/utils/logger';
import { Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import handleErrorInDbRequest from '../helpers/errorHandlers/handleErrorInDbRequest';
import handleRecordNotFoundError from '../helpers/errorHandlers/handleRecordNotFoundError';
import handleValidationError from '../helpers/errorHandlers/handleValidationError';

const router = Router();

router.get('/list', async (req, res) => {
  logger.debug({
    category: 'router',
    message: 'Get genres request',
  });

  let genres: Genre[];

  try {
    genres = await Genre.findAll();
  } catch (err) {
    handleErrorInDbRequest(res, err, 'Cannot retain genres from db');

    return;
  }

  logger.debug({
    category: 'router',
    message: 'Send genres',
  });

  res.json({
    genres,
  });
});

type GenreBody = {
  name: String;
  description: String;
};

router.post(
  '/create',
  [
    body('name')
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
      .withMessage(`Should be unique`),
    body('description')
      .isString()
      .withMessage(`Should be string`)
      .not()
      .isEmpty()
      .withMessage('Shouldn\'t be empty')
      .isLength({ max: maxDescriptionLength })
      .withMessage(`Should have length <= ${maxDescriptionLength}`),
  ],
  async (req: Request, res: Response) => {
    logger.debug({
      category: 'router',
      message: 'Get create genre request',
      data: {
        body: req.body,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validaionErrors = errors.array();

      handleValidationError(
        res,
        validaionErrors,
        'Create genre request failed validation',
      );

      return;
    }

    const body = <GenreBody>req.body;

    const newGenre = new Genre({
      name: body.name,
      description: body.description,
    });

    try {
      await newGenre.save();
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot save genre to db');

      return;
    }

    logger.debug({
      category: 'router',
      message: 'Save new genre',
      data: {
        genre: newGenre.toJSON(),
      },
    });

    res.json({
      genre: newGenre.toJSON(),
    });
  },
);

type GetGenreParams = {
  id: string;
};

router.get(
  '/:id',
  [
    param('id')
      .not()
      .isEmpty()
      .withMessage('Should not be empty'),
  ],
  async (req: Request, res: Response) => {
    const params = (<GetGenreParams>req.params);

    logger.debug({
      category: 'router',
      message: 'Get genre request',
      data: {
        id: params.id,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validaionErrors = errors.array();

      handleValidationError(
        res,
        validaionErrors,
        'Get genre request failed validation',
      );

      return;
    }

    let genre: Genre | null;

    try {
      genre = await Genre.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain genre from db');

      return;
    }

    if (!genre) {
      handleRecordNotFoundError(
        res,
        'Genre not found',
        {
          id: params.id,
        },
      );

      return;
    }

    logger.debug({
      category: 'router',
      message: 'Send genre',
    });

    res.json({
      genre,
    });
  },
 );

export default router;
