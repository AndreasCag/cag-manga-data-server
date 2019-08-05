
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

type GenreListResponseBody = {
  genres: Genre[];
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

// const updatedTestGenre = {
//   name: 'New test genre2',
//   description: 'New test genre description2',
//   image: 'image_5',
// };

describe('/mangas route', () => {
  // describe('/list subroute', () => {
  //   it('returns list of genres', async () => {
  //     const response = await supertest(app)
  //       .get('/genres/list');

  //     const body = <GenreListResponseBody>response.body;

  //     expect(response.status)
  //       .toBe(200);

  //     expect(body.genres)
  //       .toMatchObject(seedData);
  //   });
  // });

  describe('/create subroute', () => {
    it('creates new manga', async () => {
      const [genre] = await Genre.findAll();

      const testMangaWithGenre = {
        ...testManga,
        genres: [genre.id],
      };

      const response = await supertest(app)
        .post('/mangas/create')
        .send(testMangaWithGenre);

      const body = <MangaResponseBody>response.body;

      expect(response.status)
        .toBe(200);

      expect(body)
        .toMatchObject({
          genre: testMangaWithGenre,
        });
    });

    // it('Send error if genre with similar name already exists', async () => {
    //   const response = await supertest(app)
    //     .post('/genres/create')
    //     .send(testGenre);

    //   const body = <GenreListResponseBody>response.body;

    //   expect(response.status)
    //     .toBe(422);

    //   expect(body)
    //     .toMatchObject({
    //       code: 3,
    //       data: {
    //         errors: [{
    //           param: 'name',
    //         }],
    //       },
    //     });
    // });

    // it('Sends error if name or description doesn\'t set', async () => {
    //   const response = await supertest(app)
    //     .post('/genres/create')
    //     .send({ name: '', genre: '' });

    //   const body = <ValidationErrorBody>response.body;

    //   expect(response.status)
    //     .toBe(422);

    //   expect(body)
    //     .toEqual(
    //       generateValidationErrorBody('name', 'description'),
    //     );
    // });
  });

  // describe('/:id subroute', () => {
  //   it('returns selected genre', async () => {
  //     const response = await supertest(app)
  //       .get('/genres/4');

  //     const body = <GenreResponseBody>response.body;

  //     expect(response.status)
  //       .toBe(200);

  //     expect(body.genre)
  //       .toMatchObject(testGenre);
  //   });

  //   it('returns error if genre doesn\'t exist', async () => {
  //     const id = 100;

  //     const response = await supertest(app)
  //       .get(`/genres/${id}`);

  //     const body = response.body;

  //     expect(response.status)
  //       .toBe(404);

  //     expect(body)
  //       .toEqual(
  //         expect.objectContaining({
  //           code: 4,
  //           data: {
  //             id: id.toString(),
  //           },
  //         }),
  //       );
  //   });
  // });

  // describe('/:id/edit subroute', () => {
  //   it('edits selected genre', async () => {
  //     const response = await supertest(app)
  //       .put('/genres/4/edit')
  //       .send(updatedTestGenre);

  //     const body = <GenreResponseBody>response.body;

  //     expect(response.status)
  //       .toBe(200);

  //     expect(body.genre)
  //       .toMatchObject(updatedTestGenre);
  //   });

  //   it('returns error if genre doesn\'t exist', async () => {
  //     const id = 100;

  //     const response = await supertest(app)
  //       .put(`/genres/${id}/edit`)
  //       .send(testGenre);

  //     const body = response.body;

  //     expect(response.status)
  //       .toBe(404);

  //     expect(body)
  //       .toEqual(
  //         expect.objectContaining({
  //           code: 4,
  //           data: {
  //             id: id.toString(),
  //           },
  //         }),
  //       );
  //   });

  //   it('returns error if genre has validation errors', async () => {
  //     const response = await supertest(app)
  //       .put(`/genres/4/edit`)
  //       .send({
  //         name: seedData[0].name,
  //         description: '',
  //       });

  //     const body = response.body;

  //     expect(response.status)
  //       .toBe(422);

  //     expect(body)
  //       .toEqual(
  //         generateValidationErrorBody('name', 'description'),
  //       );
  //   });
  // });

  // describe('/:id/delete subroute', () => {
  //   it('deletes selected genre', async () => {
  //     const response = await supertest(app)
  //       .delete('/genres/4/delete');

  //     expect(response.status)
  //       .toBe(200);
  //   });

  //   it('returns error if genre doesn\'t exist', async () => {
  //     const id = 4;

  //     const response = await supertest(app)
  //       .delete(`/genres/${id}/delete`);

  //     expect(response.status)
  //       .toBe(404);

  //       expect(response.body)
  //       .toEqual(
  //         expect.objectContaining({
  //           code: 4,
  //           data: {
  //             id: id.toString(),
  //           },
  //         }),
  //       );
  //   });
  // });
});
