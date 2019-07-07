import winston, { format } from 'winston';
import { isProd } from './config';

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json(),
  ),
  transports: [
    new winston.transports.Console({ level: isProd ? 'error' : 'debug' }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
});

type LoggerPayload = {
  category: String | String[];
  message: String;
  data?: Object;
};

class LocalLogger {
  constructor(private readonly logger: winston.Logger) {}

  public info(payload: LoggerPayload) {
    this.logger.info(payload);
  }

  public warn(payload: LoggerPayload) {
    this.logger.warn(payload);
  }

  public error(payload: LoggerPayload) {
    this.logger.error(payload);
  }

  public debug(payload: LoggerPayload) {
    this.logger.debug(payload);
  }
}

export default new LocalLogger(logger);
