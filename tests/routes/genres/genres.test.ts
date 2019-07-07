import { app } from '@/api';
import ValidationErrorBody from '@/api/helpers/errorBodies/ValidationErrorBody';
import { sequelize } from '@/db';
import Genre from '@/db/models/Genre';
import supertest from 'supertest';
import { down, seedData, up } from './genres.seed';

beforeAll(async () => {
  await up(sequelize);
});

type GenreListResponseBody = {
  genres: Genre[];
};

const testGenre = {
  name: 'New test genre',
  description: 'New test genre description',
};

describe('genres route', () => {
  describe('list subroute', () => {
    it('returns list of genres', async () => {
      const response = await supertest(app)
        .get('/genres/list');

      const body = <GenreListResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body.genres)
        .toMatchObject(seedData);
    });
  });

  describe('create subroute', () => {
    it('creates new genre', async () => {
      const response = await supertest(app)
        .post('/genres/create')
        .send(testGenre);

      const body = <GenreListResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body)
        .toMatchObject({
          genre: testGenre,
        });
    });

    it('Send error if genre with similar name already exists', async () => {
      const response = await supertest(app)
        .post('/genres/create')
        .send(testGenre);

      const body = <GenreListResponseBody>response.body;

      expect(response.status)
        .toBe(422);

      expect(body)
        .toMatchObject({
          code: 3,
          data: {
            errors: [{
              param: 'name',
            }],
          },
        });
    });

    it('Send error if name or description don\'t setted', async () => {
      const response = await supertest(app)
        .post('/genres/create')
        .send({ name: '', genre: '' });

      const body = <ValidationErrorBody>response.body;

      expect(response.status)
        .toBe(422);

      expect(body)
        .toEqual(
          expect.objectContaining({
            code: 3,
            data: {
              errors: expect.arrayContaining([
                expect.objectContaining({ param: 'name' }),
                expect.objectContaining({ param: 'description' }),
              ]),
            },
          }),
        );
    });
  });
});

afterAll(async () => {
  await down(sequelize);
});
