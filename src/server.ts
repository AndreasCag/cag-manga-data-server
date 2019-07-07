// tslint:disable-next-line no-import-side-effect
import 'module-alias/register';

import { app } from '@/api';
import { initialiseDb } from './db';
import InitialiseAppError from './errors/InitialiseAppError';
import { PORT } from './utils/config';
import logger from './utils/logger';

const startServer = async () => {
  try {
    await initialiseDb();

    logger.info({
      category: 'core',
      message: 'Db initialised',
    });

    app.listen(PORT, () => {
      logger.info({
        category: 'core',
        message: `Example app is listening`,
        data: { port: PORT },
      });
    });
  } catch (err) {
    logger.error({
      category: 'core',
      message: 'Cannot connect to db',
    });

    throw new InitialiseAppError();
  }
};

export const sartServerPromise = startServer();
export { app };
