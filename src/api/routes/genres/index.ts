import Genre from '@/db/models/Genre';
import logger from '@/utils/logger';
import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import handleErrorInDbRequest from '../../helpers/errorHandlers/handleErrorInDbRequest';
import handleRecordNotFoundError from '../../helpers/errorHandlers/handleRecordNotFoundError';
import handleValidationError from '../../helpers/errorHandlers/handleValidationError';
import {
  descriptionBodyValidator,
  idParamValidator,
  imageBodyValidator,
  newNameBodyValidator,
  updateNameBodyValidator,
} from './validators';

export type GenreParams = {
  id: string;
};

type GenreBody = {
  name: string;
  description: string;
  image: string;
};

const router = Router();

router.get('/list', async (req, res) => {
  logger.debug({
    category: ['router', 'genresList'],
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
    category: ['router', 'genresList'],
    message: 'Send genres',
  });

  res.json({
    genres: genres.map(genre => genre.toStructuredJSON()),
  });
});

router.post(
  '/create',
  [
    newNameBodyValidator,
    descriptionBodyValidator,
    imageBodyValidator,
  ],
  async (req: Request, res: Response) => {
    logger.debug({
      category: ['router', 'createGenre'],
      message: 'Get create genre request',
      data: {
        body: req.body,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array();

      handleValidationError(
        res,
        validationErrors,
        'Create genre request failed validation',
      );

      return;
    }

    const body = <GenreBody>req.body;

    const newGenre = new Genre({
      name: body.name,
      description: body.description,
      image: body.image,
    });

    try {
      await newGenre.save();
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot save genre to db');

      return;
    }

    logger.debug({
      category: ['router', 'createGenre'],
      message: 'Save new genre',
      data: {
        genre: newGenre.toStructuredJSON(),
      },
    });

    res.json({
      genre: newGenre.toStructuredJSON(),
    });
  },
);

router.get(
  '/:id',
  [
    idParamValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<GenreParams>req.params);

    logger.debug({
      category: ['router', 'getGenre'],
      message: 'Get genre request',
      data: {
        id: params.id,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array();

      handleValidationError(
        res,
        validationErrors,
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
      category: ['router', 'getGenre'],
      message: 'Send genre',
    });

    res.json({
      genre: genre.toStructuredJSON(),
    });
  },
);

router.put(
  '/:id/edit',
  [
    idParamValidator,
    updateNameBodyValidator,
    descriptionBodyValidator,
    imageBodyValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<GenreParams>req.params);

    logger.debug({
      category: ['router', 'editGenre'],
      message: 'Edit genre request',
      data: {
        id: params.id,
        body: req.body,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array();

      handleValidationError(
        res,
        validationErrors,
        'Edit genre request failed validation',
      );

      return;
    }

    let genre: Genre | null;

    try {
      genre = await Genre.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain genre to update from db');

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

    const body = <GenreBody>req.body;
    let updatedGenre: Genre;

    try {
      updatedGenre = await genre.update({
        name: body.name,
        description: body.description,
        image: body.image,
      });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot update genre in db');

      return;
    }

    logger.debug({
      category: ['router', 'editGenre'],
      message: 'Genre successfully updated',
      data: {
        genre: updatedGenre.toStructuredJSON(),
      },
    });

    res.json({
      genre: updatedGenre.toStructuredJSON(),
    });
  },
);

router.delete(
  '/:id/delete',
  [
    idParamValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<GenreParams>req.params);

    logger.debug({
      category: ['router', 'deleteGenre'],
      message: 'Delete genre request',
      data: {
        id: params.id,
      },
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array();

      handleValidationError(
        res,
        validationErrors,
        'Delete genre request failed validation',
      );

      return;
    }

    let genre: Genre | null;

    try {
      genre = await Genre.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain genre to delete from db');

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

    try {
      await genre.destroy();
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot delete genre in db');

      return;
    }

    logger.debug({
      category: ['router', 'deleteGenre'],
      message: 'Genre successfully deleted',
      data: {
        genre: genre.toJSON(),
      },
    });

    res
      .status(200)
      .send();
  },
);

export default router;
