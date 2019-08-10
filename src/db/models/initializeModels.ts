import { Sequelize } from 'sequelize';
import Chapter, { initChapter, initChapterAssociations } from './Chapter';
import { initGenre, initGenreAssociations } from './Genre';
import Manga, { initManga, initMangaAssociations } from './Manga';
import { initMangaGenre } from './MangaGenre';
import { initPicture, initPictureAssociations } from './Picture';

export default (sequelize: Sequelize) => {
  initManga(sequelize);
  initGenre(sequelize);
  initMangaGenre(sequelize);
  initPicture(sequelize);
  initChapter(sequelize);

  initMangaAssociations();
  initGenreAssociations();
  initPictureAssociations();
  initChapterAssociations();
};
