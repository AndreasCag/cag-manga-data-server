export const PORT = Boolean(process.env.PORT)
  ? process.env.PORT
  : 3000;

export const isDev = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
export const isProd = process.env.NODE_ENV === 'production';
