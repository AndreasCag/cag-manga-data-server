import logger from '@/utils/logger';

import { sequelize } from '@/db';
import Genre from '@/db/models/Genre';
import Manga, { CompleteType } from '@/db/models/Manga';
import { GenreType, isGenreType } from '@/db/models/MangaGenre';
import { isObject } from '@/utils/globalTypeGuards';
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
  releaseDateValidator,
  subgenresBodyValidator,
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
  subgenres: number[];
  releaseDate?: number;
};

const router = Router();

router.get('/list', async (req, res) => {
  logger.debug({
    category: ['router', 'mangasList'],
    message: 'Get mangas request',
  });

  let mangas: Genre[];

  try {
    mangas = await Manga.findAll();
  } catch (err) {
    handleErrorInDbRequest(res, err, 'Cannot retain mangas from db');

    return;
  }

  logger.debug({
    category: ['router', 'mangasList'],
    message: 'Send mangas',
  });

  res.json({
    mangas,
  });
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
    subgenresBodyValidator,
    releaseDateValidator,
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
      releaseDate: body.releaseDate,
    }, { include: [{ model: Genre, as: 'genres' }] });

    let newSavedMangaWithGenres: Manga;

    try {
      newSavedMangaWithGenres = await sequelize.transaction(async (t) => {
        await newManga.save({ transaction: t });
        await Promise.all([
          newManga.addGenres(
            body.genres,
            {
              // @ts-ignore I don't have typings for through attribute? Have to check it out
              through: { genreType: 'genre' },
              transaction: t,
            },
          ),
          newManga.addGenres(
            body.subgenres,
            {
              // @ts-ignore I don't have typings for through attribute? Have to check it out
              through: { genreType: 'subgenre' },
              transaction: t,
            },
          ),
        ]);

        newSavedMangaWithGenres = (await Manga.findOne({
          where: { id: newManga.id },
          transaction: t,
          include: [{
            model: Genre,
            as: 'genres',
          }],
        }))!;

        return newSavedMangaWithGenres;
      });
    } catch (err) {
      handleErrorInDbRequest(res, err, 'Cannot save manga to db');

      return;
    }

    logger.debug({
      category: ['router', 'createManga'],
      message: 'Save new manga',
      data: {
        manga: newSavedMangaWithGenres.toJSON(),
      },
    });

    res.json({
      manga: newSavedMangaWithGenres.toStructuredNestedJSON(),
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
    releaseDateValidator,
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
          releaseDate: body.releaseDate,
        }, { transaction: t });

        await updatedManga.setGenres(
          body.genres,
          {
            // @ts-ignore Jesus wtf I don't have typings for through attribute? Have to check it out
            through: { genreType: 'genre' },
            transaction: t,
          },
        );
        await updatedManga.addGenres(
          body.subgenres,
          {
            // @ts-ignore Jesus wtf I don't have typings for through attribute? Have to check it out
            through: { genreType: 'subgenre' },
            transaction: t,
          },
        );

        return (await Manga.findOne({
          where: { id: updatedManga.id },
          transaction: t,
          include: [{
            model: Genre,
            as: 'genres',
          }],
        }))!;
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
      manga: updatedManga.toStructuredNestedJSON(),
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
