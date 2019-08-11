
import { app } from '@/api';
import ValidationErrorBody from '@/api/helpers/errorBodies/ValidationErrorBody';
import { sequelize } from '@/db';
import Genre from '@/db/models/Genre';
import Manga from '@/db/models/Manga';
import supertest from 'supertest';
import generateValidationErrorBody from 'tests/helpers/generateValidationErrorBody';
import { down, up } from './mangas.seed';

beforeAll(async () => {
  await up(sequelize);
});

afterAll(async () => {
  await down(sequelize);
});

type MangaListResponseBody = {
  mangas: Manga[];
};

type MangaResponseBody = {
  manga: Manga;
};

// public name!: string;
// public completeType!: 'ongoing' | 'completed';
// public description!: string;
// public mainImage!: string;
// public backgroundImage!: string;
const testManga = {
  name: 'New test genre',
  completeType: 'ongoing',
  description: 'New test genre description',
  mainImage: 'main image',
  backgroundImage: 'background image',
};

const updatedTestManga = {
  name: 'New test genre 2',
  completeType: 'completed',
  description: 'New test genre description 2',
  mainImage: 'main image 2',
  backgroundImage: 'background image 2',
};

// const updatedTestGenre = {
//   name: 'New test genre2',
//   description: 'New test genre description2',
//   image: 'image_5',
// };

describe('/mangas route', () => {

  describe('/create subroute', () => {
    it('creates new manga', async () => {
      const [firstGenre, secondGenre] = await Genre.findAll();

      const testMangaWithGenre = {
        ...testManga,
        genres: [firstGenre.id],
        subgenres: [secondGenre.id],
      };

      const response = await supertest(app)
        .post('/mangas/create')
        .send(testMangaWithGenre);

      const body = <MangaResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body)
        .toMatchObject({
          manga: {
            ...testManga,
            genres: [
              expect.objectContaining({
                id: firstGenre.id,
              }),
            ],
            subgenres: [
              expect.objectContaining({
                id: secondGenre.id,
              }),
            ],
          },
        });
    });

    it('sends validation errors', async () => {
      const response = await supertest(app)
        .post('/mangas/create')
        .send({
          name: '',
          completeType: '',
          description: '',
          mainImage: '',
          backgroundImage: '',
        });

      const body = <MangaResponseBody>response.body;

      expect(response.status)
        .toBe(422);

      expect(body)
        .toEqual(
          generateValidationErrorBody(
            'name',
            'completeType',
            'description',
            'mainImage',
            'backgroundImage',
            'genres',
            'genres',
            'subgenres',
            'subgenres',
          ),
        );
    });
  });

  describe('/list subroute', () => {
    it('returns list of genres', async () => {
      const response = await supertest(app)
        .get('/mangas/list');

      const body = <MangaListResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body.mangas)
        .toMatchObject([testManga]);
    });
  });

  describe('/:id subroute', () => {
    it('returns selected manga', async () => {
      const manga = (await Manga.findOne())!;
      const response = await supertest(app)
        .get(`/mangas/${manga.id}`);

      const body = <MangaResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body.manga)
        .toMatchObject(testManga);
    });

    it('returns error if manga doesn\'t exist', async () => {
      const id = -100;

      const response = await supertest(app)
        .get(`/mangas/${id}`);

      const body = response.body;

      expect(response.status)
        .toBe(404);

      expect(body)
        .toEqual(
          expect.objectContaining({
            code: 4,
            data: {
              id: id.toString(),
            },
          }),
        );
    });
  });

  describe('/:id/edit subroute', () => {
    it('edits selected manga', async () => {
      const manga = (await Manga.findOne())!;
      const [firstGenre, secondGenre] = await Genre.findAll();

      const response = await supertest(app)
        .put(`/mangas/${manga.id}/edit`)
        .send({
          ...updatedTestManga,
          genres: [secondGenre.id],
          subgenres: [firstGenre.id],
        });

      const body = <MangaResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body.manga)
        .toMatchObject({
          ...updatedTestManga,
          genres: [{
            id: secondGenre.id,
          }],
          subgenres: [{
            id: firstGenre.id,
          }],
        });
    });

    it('returns error if manga doesn\'t exist', async () => {
      const id = -100;

      const response = await supertest(app)
        .put(`/mangas/${id}/edit`)
        .send({
          ...testManga,
          genres: [],
          subgenres: [],
        });

      const body = response.body;

      expect(response.status)
        .toBe(404);

      expect(body)
        .toEqual(
          expect.objectContaining({
            code: 4,
            data: {
              id: id.toString(),
            },
          }),
        );
    });

    it('returns error if genre has validation errors', async () => {
      const manga = (await Manga.findOne())!;

      const response = await supertest(app)
        .put(`/mangas/${manga.id}/edit`)
        .send({});

      const body = response.body;

      expect(response.status)
        .toBe(422);

      expect(body)
        .toEqual(
          generateValidationErrorBody(
            'name',
            'name',
            'completeType',
            'description',
            'description',
            'mainImage',
            'mainImage',
            'backgroundImage',
            'backgroundImage',
            'genres',
            'genres',
          ),
        );
    });
  });

  describe('/:id/delete subroute', () => {
    it('deletes selected manga', async () => {
      const manga = (await Manga.findOne())!;

      const response = await supertest(app)
        .delete(`/mangas/${manga.id}/delete`);

      expect(response.status)
        .toBe(200);
    });

    it('returns error if genre doesn\'t exist', async () => {
      const id = -100;

      const response = await supertest(app)
        .delete(`/mangas/${id}/delete`);

      expect(response.status)
        .toBe(404);

        expect(response.body)
        .toEqual(
          expect.objectContaining({
            code: 4,
            data: {
              id: id.toString(),
            },
          }),
        );
    });
  });
});
