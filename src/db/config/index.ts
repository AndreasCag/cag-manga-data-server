import { isDev, isTest } from '@/utils/config';
import ConfigJson from './.config.json';

export const POSTGRES_URI = isDev
  ? ConfigJson.development.url
  : isTest
    ? ConfigJson.test.url
    : ConfigJson.production.url;
