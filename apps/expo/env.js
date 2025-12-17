/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
const dotenv = require('dotenv');
const packageJson = require('./package.json');
const z = require('zod');

const APP_ENV = process.env.APP_ENV ?? 'development';

const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);
console.log('loading env from:', envPath);

dotenv.config({ path: envPath });

const NAME = '냥토닥';
const VERSION = packageJson.version;
const SLUG = 'nyangtodac';
const SCHEME = 'nyangtodac';
const IOS_BUNDLE_IDENTIFIER = 'com.taewoongheo.nyangtodac';
const ANDROID_PACKAGE = 'com.taewoongheo.nyangtodac';

// define env schema
const client = z.object({
  APP_ENV: z.enum(['development', 'production']),
  NAME: z.string(),
  VERSION: z.string(),
  SLUG: z.string(),
  SCHEME: z.string(),
  IOS_BUNDLE_IDENTIFIER: z.string(),
  ANDROID_PACKAGE: z.string(),

  // add client environment variables here
  BASE_URL: z.string(),
  ACCESS_TOKEN: z.string(),
});

const buildTime = z.object({
  // add build environment variables here
});

// define env values
const _clientEnv = {
  APP_ENV,
  NAME,
  VERSION,
  SLUG,
  SCHEME,
  IOS_BUNDLE_IDENTIFIER,
  ANDROID_PACKAGE,

  // add client environment variables here
  BASE_URL: process.env.BASE_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
};

const _buildTimeEnv = {
  // add build environment variables here
};

const ClientEnv = client.safeParse(_clientEnv);
const BuildTimeEnv = buildTime.safeParse(_buildTimeEnv);

if (!ClientEnv.success || !BuildTimeEnv.success) {
  console.error('Invalid environment variables');
  throw new Error('Invalid environment variables');
}

console.log('ClientEnv: ', ClientEnv.data);

module.exports = {
  ClientEnv: ClientEnv.data,
  BuildTimeEnv: BuildTimeEnv.data,
};
