import logger from '@/utils/logger';

import { sequelize } from '@/db';
import Genre from '@/db/models/Genre';
import Manga, { CompleteType } from '@/db/models/Manga';
import { Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import handleErrorInDbRequest from '../../helpers/errorHandlers/handleErrorInDbRequest';
import handleRecordNotFoundError from '../../helpers/errorHandlers/handleRecordNotFoundError';
import handleValidationError from '../../helpers/errorHandlers/handleValidationError';
import {
  backgroundImageBodyValidator,
  completeTypeBodyValidator,
  descriptionBodyValidator,
  genresBodyValidator,
  idParamValidator,
  mainImageBodyValidator,
  nameBodyValidator,
} from './validators';

export type MangaParams = {
  id: string;
};

type MangaBody = {
  name: string;
  completeType: CompleteType;
  description: string;
  mainImage: string;
  backgroundImage: string;
  genres: number[];
};

const router = Router();

router.get('/list', async (req, res) => {
  // @TODO Implement
});

// public name!: string;
// public completeType!: 'ongoing' | 'completed';
// public description!: string;
// public mainImage!: string;
// public backgroundImage!: string;
router.post(
  '/create',
  [
    nameBodyValidator,
    completeTypeBodyValidator,
    descriptionBodyValidator,
    mainImageBodyValidator,
    backgroundImageBodyValidator,
    genresBodyValidator,
  ],
  async (req: Request, res: Response) => {
    logger.debug({
      category: ['router', 'createMangas'],
      message: 'Get create manga request',
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
        'Create manga request failed validation',
      );

      return;
    }

    const body = <MangaBody>req.body;

    const newManga = new Manga({
      name: body.name,
      completeType: body.completeType,
      description: body.description,
      mainImage: body.mainImage,
      backgroundImage: body.backgroundImage,
    }, { include: [{ model: Genre, as: 'genres' }] });

    try {
      await sequelize.transaction(async (t) => {
        await newManga.save({ transaction: t });
        await newManga.setGenres(body.genres, { transaction: t });
        // await newManga.getGenres({ transaction: t });

        const createdManga = await Manga.findOne({
          where: { id: newManga.id },
          transaction: t,
          include: [{
            model: Genre,
            as: 'genres',
          }],
        });

        logger.debug({
          category: ['router', 'createManga'],
          message: 'Test saved manga',
          data: {
            manga: createdManga!.toJSON(),
          },
        });
      });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot save manga to db');

      return;
    }

    logger.debug({
      category: ['router', 'createManga'],
      message: 'Save new manga',
      data: {
        manga: newManga.toJSON(),
        genres: typeof newManga.genres!,
      },
    });

    res.json({
      genre: newManga.toJSON(),
    });
  },
);

router.get(
  '/:id',
  [
    idParamValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<MangaParams>req.params);

    logger.debug({
      category: ['router', 'getManga'],
      message: 'Get manga request',
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
        'Get manga request failed validation',
      );

      return;
    }

    let manga: Manga | null;

    try {
      manga = await Manga.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain manga from db');

      return;
    }

    if (!manga) {
      handleRecordNotFoundError(
        res,
        'Manga not found',
        {
          id: params.id,
        },
      );

      return;
    }

    logger.debug({
      category: ['router', 'getManga'],
      message: 'Send manga',
    });

    res.json({
      manga,
    });
  },
);

router.put(
  '/:id/edit',
  [
    idParamValidator,
    nameBodyValidator,
    completeTypeBodyValidator,
    descriptionBodyValidator,
    mainImageBodyValidator,
    backgroundImageBodyValidator,
    genresBodyValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<MangaParams>req.params);

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

    let manga: Manga | null;

    try {
      manga = await Manga.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain manga to update from db');

      return;
    }

    if (!manga) {
      handleRecordNotFoundError(
        res,
        'Manga not found',
        {
          id: params.id,
        },
      );

      return;
    }

    const body = <MangaBody>req.body;
    let updatedManga: Manga;

    try {
      updatedManga = await sequelize.transaction(async (t) => {
        const updatedManga = await manga!.update({
          name: body.name,
          completeType: body.completeType,
          description: body.description,
          mainImage: body.mainImage,
          backgroundImage: body.backgroundImage,
        }, { transaction: t });
        await updatedManga.setGenres(body.genres, { transaction: t });

        return updatedManga;
      });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot update manga in db');

      return;
    }

    logger.debug({
      category: ['router', 'editManga'],
      message: 'Manga successfully updated',
      data: {
        manga: updatedManga.toJSON(),
      },
    });

    res.json({
      manga: updatedManga,
    });
  },
);

router.delete(
  '/:id/delete',
  [
    idParamValidator,
  ],
  async (req: Request, res: Response) => {
    const params = (<MangaParams>req.params);

    logger.debug({
      category: ['router', 'deleteManga'],
      message: 'Delete manga request',
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
        'Delete manga request failed validation',
      );

      return;
    }

    let manga: Manga | null;

    try {
      manga = await Manga.findOne({ where: { id: params.id } });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot retain manga to delete from db');

      return;
    }

    if (!manga) {
      handleRecordNotFoundError(
        res,
        'Manga not found',
        {
          id: params.id,
        },
      );

      return;
    }

    try {
      await manga.destroy();
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot delete manga in db');

      return;
    }

    logger.debug({
      category: ['router', 'deleteManga'],
      message: 'Manga successfully deleted',
      data: {
        manga: manga.toJSON(),
      },
    });

    res
      .status(200)
      .send();
  },
);

export default router;
